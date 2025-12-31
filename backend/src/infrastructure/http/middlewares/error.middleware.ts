import { Request, Response, NextFunction } from "express";
import { HttpException } from "../errors/HttpException";

/**
 * Middleware global de manejo de errores
 * 
 * ¿Por qué centralizar el manejo de errores?
 * - Consistencia: Todas las respuestas de error tienen el mismo formato
 * - Logging: Un solo lugar para registrar errores
 * - Seguridad: Evita exponer detalles internos en producción
 * 
 * ¿Cuándo se ejecuta?
 * - Cuando un controlador lanza una excepción
 * - Cuando un middleware llama next(error)
 * - Debe ser el ÚLTIMO middleware registrado
 */
export function errorHandler(err: Error | HttpException, req: Request, res: Response, next: NextFunction): void {
	console.error("[Error]", err);

	const status = err instanceof HttpException ? err.status : 500;
	const message = err.message || "Internal Server Error";

	// Construir respuesta de error
	const errorResponse: any = {
		success: false,
		error: {
			message,
		},
	};

	// Si hay datos adicionales (ej: errores de validación), incluirlos
	if (err instanceof HttpException && err.data) {
		errorResponse.error = {
			...errorResponse.error,
			...err.data,
		};
	}

	res.status(status).json(errorResponse);
}
