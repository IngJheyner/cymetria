# Cymetria - Prueba Técnica Fullstack

Monorepo para la prueba técnica fullstack de Cymetria, implementando una aplicación completa con arquitectura hexagonal en el backend y React en el frontend.

## 📁 Estructura del Proyecto

```
cymetria/
├── backend/           # API REST con Node.js, Express y TypeScript
│   ├── src/          # Código fuente (Arquitectura Hexagonal)
│   ├── docker-compose.yml  # Base de datos MySQL
│   ├── package.json
│   └── ...
├── frontend/         # (Próximamente) Interfaz web con React + Next.js
└── README.md         # Este archivo
```

---

## 🎯 Requerimientos Implementados

### ✅ Backend

#### 1. CRUD de Usuarios (Completado)
- ✅ Paginación obligatoria con metadata completa
- ✅ Arquitectura hexagonal (Puertos y Adaptadores)
- ✅ Validación con Zod
- ✅ Manejo centralizado de errores
- ✅ Orden determinístico de resultados

#### 2. Exportación Escalable (Completado)
- ✅ Export a CSV con streaming
- ✅ Caché de exportaciones
- ✅ Chunking para optimizar memoria
- ✅ Soporta 5K+ usuarios sin bloqueo

#### 3. Pruebas Unitarias (Completado)
- ✅ 12 tests unitarios con Jest
- ✅ Tests de UserService (caso de uso)
- ✅ Tests de UserRepository (adaptador)
- ✅ 100% de tests pasando

#### 4. Frontend (Pendiente)
- ⏳ React + Next.js
- ⏳ React Query para data fetching
- ⏳ Zustand para estado global
- ⏳ Tailwind CSS para estilos

---

## 🚀 Cómo Empezar

### Backend

1. **Navegar a la carpeta backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. **Levantar la base de datos (Docker):**
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar en modo desarrollo:**
   ```bash
   pnpm dev
   ```

6. **Ejecutar tests:**
   ```bash
   pnpm test
   ```

La API estará disponible en: `http://localhost:3000`

**Endpoints principales:**
- `GET /api/v1/users` - Listar usuarios (paginado)
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `POST /api/v1/users` - Crear usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario
- `GET /api/v1/users/export` - Exportar usuarios a CSV

**Adminer (Gestor de BD):** `http://localhost:8080`

---

### Frontend (Próximamente)

```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Arquitectura del Backend

### Arquitectura Hexagonal (Puertos y Adaptadores)

```
src/
├── domain/                  # Capa de Dominio (Núcleo)
│   ├── entities/           # Entidades puras (User)
│   ├── ports/              # Interfaces (UserRepository)
│   └── types/              # Tipos del dominio (Pagination)
│
├── infrastructure/         # Capa de Infraestructura
│   ├── db/
│   │   └── sequelize/     # Adaptador de Sequelize
│   │       ├── models/    # Modelos de BD (UserModel)
│   │       └── repositories/  # Implementación de puertos
│   │
│   └── http/              # Adaptador HTTP (Express)
│       ├── controllers/   # Controladores REST
│       ├── routes/        # Definición de rutas
│       ├── services/      # Servicios de aplicación (lógica)
│       ├── middlewares/   # Middlewares (validación, errores)
│       └── validators/    # Esquemas de validación (Zod)
│
└── config/                # Configuraciones (DB, ENV)
```

**Principios clave:**
- ✅ El dominio NO depende de frameworks
- ✅ Dependencias apuntan hacia el dominio (inversión)
- ✅ Fácil cambio de ORM, framework o DB
- ✅ Testeable con mocks

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Tests con cobertura
pnpm test:coverage

# Tests con salida detallada
pnpm test:verbose
```

**Cobertura:**
- 7 tests de UserService (lógica de negocio)
- 5 tests de UserRepository (adaptador)

---

## 🗄️ Base de Datos

**Tecnología:** MySQL 8.0 con Docker

**Gestión:**
- Docker Compose para levantar MySQL
- Adminer en puerto 8080 para gestión visual
- Sequelize como ORM

**Comandos útiles:**
```bash
# Levantar base de datos
docker-compose up -d

# Ver logs
docker-compose logs -f mysql

# Detener base de datos
docker-compose down

# Detener y eliminar volúmenes (cuidado: borra datos)
docker-compose down -v
```

---

## 📦 Stack Tecnológico

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Lenguaje:** TypeScript
- **ORM:** Sequelize
- **Validación:** Zod
- **Testing:** Jest + ts-jest
- **DI:** TSyringe
- **Base de datos:** MySQL 8.0
- **Exportación:** fast-csv

### Frontend (Próximamente)
- **Framework:** Next.js 14+
- **UI Library:** React 18+
- **Data Fetching:** React Query (TanStack Query)
- **Estado Global:** Zustand
- **Estilos:** Tailwind CSS
- **UI Components:** DaisyUI / shadcn/ui

---

## 📚 Documentación Adicional

Dentro de `backend/` encontrarás documentación detallada:

- `GUIA_PEDAGOGICA_ARQUITECTURA.md` - Explicación detallada de la arquitectura hexagonal
- `CRUD_DOCUMENTATION.md` - Documentación del CRUD y paginación
- `EXPORTACION_ESCALABILIDAD.md` - Estrategia de exportación escalable
- `TESTS_ESTRATEGIA.md` - Estrategia y guía de testing
- `DOCKER_SETUP.md` - Guía completa de Docker
- `PRUEBAS_MANUALES.md` - Guía para probar endpoints manualmente

---

## 👨‍💻 Autor

**Desarrollador:** [Tu Nombre]  
**Prueba Técnica para:** Cymetria Group  
**Fecha:** Diciembre 2024

---

## 📝 Notas

- El proyecto usa pnpm como gestor de paquetes (también compatible con npm)
- La base de datos usa el puerto 3307 para evitar conflictos con MySQL locales
- Los tests NO requieren base de datos (usan mocks)
- La exportación de usuarios soporta grandes volúmenes sin bloqueo

---

## 🔜 Próximos Pasos

1. ⏳ Implementar frontend con React + Next.js
2. ⏳ Integrar frontend con backend
3. ⏳ Deploy (opcional)

