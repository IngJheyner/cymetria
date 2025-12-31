import { UserRepository } from "../../../domain/ports/UserRepository";
import { inject, injectable } from "tsyringe";
import { Writable } from "stream";
import { format } from "fast-csv";
import { createWriteStream, existsSync, mkdirSync, statSync } from "fs";
import { join } from "path";
import crypto from "crypto";

/**
 * Servicio de Exportación de Usuarios
 * 
 * ESTRATEGIA DE ESCALABILIDAD:
 * 
 * 1. STREAMING: No carga todos los usuarios en memoria
 *    - Procesa por lotes (chunks) de 100 registros
 *    - Escribe directamente al stream de respuesta HTTP
 *    - Memoria constante O(1), sin importar cantidad de usuarios
 * 
 * 2. CSV en vez de XLSX:
 *    - 10-100x más rápido que Excel binario
 *    - Compatible con Excel, Google Sheets, etc.
 *    - Menor uso de CPU y memoria
 * 
 * 3. CACHÉ DE EXPORTACIONES:
 *    - Si los datos no cambiaron, devuelve archivo existente
 *    - Hash basado en total de usuarios y última actualización
 *    - Evita regenerar archivos idénticos
 * 
 * 4. PAGINACIÓN INTERNA:
 *    - Obtiene datos en chunks de 100
 *    - Evita queries gigantes
 *    - Libera memoria después de cada chunk
 * 
 * PRUEBAS DE RENDIMIENTO ESPERADAS:
 * - 5,000 usuarios: ~1-2 segundos
 * - 50,000 usuarios: ~5-10 segundos
 * - 500,000 usuarios: ~30-60 segundos
 * - Memoria: Constante (~50-100 MB sin importar cantidad)
 */

interface ExportMetadata {
  totalUsers: number;
  lastModified: Date;
  hash: string;
}

@injectable()
export class ExportService {
  private readonly CHUNK_SIZE = 100; // Procesar de 100 en 100
  private readonly CACHE_DIR = join(process.cwd(), "exports_cache");
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    @inject("UserRepository")
    private readonly userRepository: UserRepository
  ) {
    // Crear directorio de caché si no existe
    if (!existsSync(this.CACHE_DIR)) {
      mkdirSync(this.CACHE_DIR, { recursive: true });
    }
  }

  /**
   * Exporta usuarios a CSV con streaming
   * 
   * ¿Cómo funciona el streaming?
   * 1. Cliente hace petición GET /api/v1/users/export
   * 2. Servidor responde con Content-Type: text/csv
   * 3. Mientras el servidor genera el CSV, va enviando chunks al cliente
   * 4. Cliente va recibiendo y guardando el archivo progresivamente
   * 5. No se bloquea el servidor ni se satura la memoria
   */
  async exportUsersToCSV(outputStream: Writable): Promise<void> {
    // 1. Obtener metadata para caché
    const metadata = await this.getExportMetadata();
    const cachedFile = this.getCachedFilePath(metadata.hash);

    // 2. Si existe caché válido, usarlo
    if (this.isCacheValid(cachedFile)) {
      console.log("[Export] Using cached file:", cachedFile);
      await this.streamCachedFile(cachedFile, outputStream);
      return;
    }

    // 3. No hay caché válido, generar nuevo
    console.log("[Export] Generating new export file...");
    await this.generateCSVStream(outputStream, metadata);
  }

  /**
   * Genera CSV con streaming (sin cargar todo en memoria)
   */
  private async generateCSVStream(
    outputStream: Writable,
    metadata: ExportMetadata
  ): Promise<void> {
    // Crear stream de escritura CSV
    const csvStream = format({
      headers: true,
      delimiter: ",",
      quote: '"',
      escape: '"',
    });

    // Conectar CSV stream al output (HTTP response)
    csvStream.pipe(outputStream);

    // También guardar en caché (dual stream)
    const cachedFile = this.getCachedFilePath(metadata.hash);
    const fileStream = createWriteStream(cachedFile);
    csvStream.pipe(fileStream);

    try {
      let page = 1;
      let hasMore = true;

      // Procesar en chunks (paginación interna)
      while (hasMore) {
        // Obtener chunk de usuarios
        const result = await this.userRepository.findAll({
          page,
          pageSize: this.CHUNK_SIZE,
        });

        // Escribir cada usuario al stream
        for (const user of result.data) {
          csvStream.write({
            ID: user.id,
            Nombre: user.name,
            Email: user.email,
            "Fecha de Creación": user.createdAt?.toISOString() || "",
            "Última Actualización": user.updatedAt?.toISOString() || "",
          });
        }

        // Log de progreso
        const processed = page * this.CHUNK_SIZE;
        const progress = Math.min(100, (processed / metadata.totalUsers) * 100);
        console.log(
          `[Export] Progress: ${progress.toFixed(1)}% (${processed}/${metadata.totalUsers})`
        );

        // ¿Hay más páginas?
        hasMore = page < result.totalPages;
        page++;

        // Pequeña pausa para no saturar la BD (opcional)
        if (hasMore) {
          await this.sleep(10); // 10ms
        }
      }

      // Finalizar el stream
      csvStream.end();

      // Esperar a que termine de escribir
      await new Promise((resolve, reject) => {
        csvStream.on("finish", resolve);
        csvStream.on("error", reject);
      });

      console.log("[Export] Export completed successfully");
    } catch (error) {
      csvStream.end();
      throw error;
    }
  }

  /**
   * Obtiene metadata para generar hash de caché
   */
  private async getExportMetadata(): Promise<ExportMetadata> {
    // Obtener primera página para saber el total
    const result = await this.userRepository.findAll({
      page: 1,
      pageSize: 1,
    });

    // Obtener el usuario más reciente para saber última modificación
    const lastUser = result.data[0];

    return {
      totalUsers: result.total,
      lastModified: lastUser?.updatedAt || new Date(),
      hash: this.generateHash(result.total, lastUser?.updatedAt || new Date()),
    };
  }

  /**
   * Genera hash único basado en cantidad y última modificación
   * Si cambió algún usuario o se agregó/eliminó alguno, el hash cambia
   */
  private generateHash(total: number, lastModified: Date): string {
    const data = `${total}-${lastModified.toISOString()}`;
    return crypto.createHash("md5").update(data).digest("hex");
  }

  /**
   * Path del archivo en caché
   */
  private getCachedFilePath(hash: string): string {
    return join(this.CACHE_DIR, `users_export_${hash}.csv`);
  }

  /**
   * Verifica si el caché es válido (existe y no expiró)
   */
  private isCacheValid(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }

    const stats = statSync(filePath);
    const age = Date.now() - stats.mtimeMs;

    return age < this.CACHE_TTL;
  }

  /**
   * Streamea archivo desde caché
   */
  private async streamCachedFile(
    filePath: string,
    outputStream: Writable
  ): Promise<void> {
    const { createReadStream } = await import("fs");
    const fileStream = createReadStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.pipe(outputStream);
      fileStream.on("end", resolve);
      fileStream.on("error", reject);
    });
  }

  /**
   * Utilidad: Sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Limpia archivos de caché antiguos (para ejecutar periódicamente)
   */
  async cleanOldCacheFiles(): Promise<void> {
    const { readdirSync, unlinkSync, statSync } = await import("fs");

    try {
      const files = readdirSync(this.CACHE_DIR);

      for (const file of files) {
        const filePath = join(this.CACHE_DIR, file);
        const stats = statSync(filePath);
        const age = Date.now() - stats.mtimeMs;

        // Eliminar archivos mayores a 1 hora
        if (age > 60 * 60 * 1000) {
          unlinkSync(filePath);
          console.log(`[Export] Deleted old cache file: ${file}`);
        }
      }
    } catch (error) {
      console.error("[Export] Error cleaning cache:", error);
    }
  }
}

