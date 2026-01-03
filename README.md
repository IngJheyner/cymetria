# Cymetria - Prueba Técnica Fullstack

> Monorepo para la prueba técnica fullstack de Cymetria, implementando una aplicación completa con arquitectura hexagonal en el backend y React moderno en el frontend.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-12%20passing-success)](./backend)

**Stack:** Node.js • Express • TypeScript • Next.js • React Query • Zustand • Tailwind CSS • MySQL • Docker

## 📑 Tabla de Contenidos

1. [Estructura del Proyecto](#-estructura-del-proyecto)
2. [Requerimientos Implementados](#-requerimientos-implementados)
3. [Cómo Empezar](#-cómo-empezar)
   - [Quick Start](#-quick-start---ejecutar-todo-el-proyecto)
   - [Backend](#backend)
   - [Frontend](#frontend)
4. [Arquitectura del Backend](#️-arquitectura-del-backend)
5. [Arquitectura del Frontend](#-arquitectura-del-frontend)
6. [Testing](#-testing)
7. [Base de Datos](#️-base-de-datos)
8. [Stack Tecnológico](#-stack-tecnológico)
9. [Documentación Adicional](#-documentación-adicional)
10. [Características Destacadas](#-características-destacadas)
11. [Solución de Problemas](#-solución-de-problemas-comunes)
12. [Proyecto Completado](#-proyecto-completado)
13. [Resumen del Proyecto](#-resumen-del-proyecto)

---

## 📁 Estructura del Proyecto

```
cymetria/
├── backend/           # API REST con Node.js, Express y TypeScript
│   ├── src/          # Código fuente (Arquitectura Hexagonal)
│   ├── docker-compose.yml  # Base de datos MySQL
│   ├── package.json
│   └── README.md     # Documentación del backend
│
├── frontend/         # Interfaz web con Next.js + React
│   ├── app/          # App Router de Next.js
│   ├── components/   # Componentes React (UI + negocio)
│   ├── lib/          # API client, hooks, store, tipos
│   ├── package.json
│   └── README.md     # Documentación del frontend
│
└── README.md         # Este archivo (documentación global)
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

#### 4. Frontend (Completado)
- ✅ Next.js 15 con App Router
- ✅ React Query (@tanstack/query) para data fetching
- ✅ Zustand para estado global UI
- ✅ shadcn/ui + Tailwind CSS para estilos
- ✅ React Hook Form + Zod para validación
- ✅ Listado paginado de usuarios
- ✅ CRUD completo (Crear, Editar, Eliminar)
- ✅ Exportación a CSV
- ✅ Manejo de estados (loading, error, empty)
- ✅ UX moderna y responsive

---

## 🚀 Cómo Empezar

### ⚡ Quick Start - Ejecutar Todo el Proyecto

Si quieres ejecutar backend + frontend + base de datos juntos:

```bash
# Terminal 1: Base de datos
cd backend
docker-compose up -d

# Terminal 2: Backend
cd backend
pnpm install
pnpm dev
# → Backend corriendo en http://localhost:3000

# Terminal 3: Frontend
cd frontend
pnpm install
pnpm dev
# → Frontend corriendo en http://localhost:3001
```

**Abrir en el navegador:** `http://localhost:3001`

---

### Backend

1. **Navegar a la carpeta backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
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

### Frontend

1. **Navegar a la carpeta frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # El archivo .env.local ya existe con:
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   pnpm dev
   ```

La aplicación estará disponible en: `http://localhost:3001`

**Funcionalidades disponibles:**
- 📋 Listado paginado de usuarios (10 por página)
- ➕ Crear nuevo usuario con validación
- ✏️ Editar usuario existente
- 🗑️ Eliminar usuario con confirmación
- 📥 Exportar usuarios a CSV
- 🔄 Paginación con navegación Anterior/Siguiente

**Requisitos:**
- ⚠️ El backend debe estar corriendo en `http://localhost:3000`
- ⚠️ CORS configurado en el backend

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

## 🎨 Arquitectura del Frontend

### Modern React Stack (Next.js + React Query + Zustand)

```
frontend/
├── app/                        # App Router de Next.js
│   ├── layout.tsx             # Layout global con Providers
│   ├── page.tsx               # Página principal (/)
│   ├── providers.tsx          # QueryClientProvider
│   └── globals.css            # Estilos globales + Tailwind
│
├── components/
│   ├── ui/                    # Componentes de shadcn/ui
│   │   ├── button.tsx         # Botones reutilizables
│   │   ├── card.tsx           # Tarjetas
│   │   ├── table.tsx          # Tablas
│   │   ├── dialog.tsx         # Modales
│   │   ├── form.tsx           # Formularios
│   │   └── ...                # Más componentes UI
│   │
│   └── users/                 # Componentes de usuarios
│       ├── user-list.tsx      # Lista paginada
│       ├── user-dialog.tsx    # Modal crear/editar
│       └── export-button.tsx  # Botón exportar CSV
│
├── lib/
│   ├── api.ts                 # Cliente Axios configurado
│   ├── types.ts               # Tipos TypeScript compartidos
│   ├── utils.ts               # Utilidades (cn, etc.)
│   │
│   ├── queries/
│   │   └── user-queries.ts    # Hooks de React Query
│   │                          # (useUsers, useCreateUser, etc.)
│   │
│   └── store/
│       └── user-store.ts      # Store de Zustand
│                              # (estado UI: modales, selección)
│
└── public/                    # Archivos estáticos
```

**Conceptos clave:**

### 1. **Server vs Client Components**
- Server Components (por defecto): Se ejecutan en el servidor, no envían JS al cliente
- Client Components (`"use client"`): Necesarios para interactividad (useState, eventos, etc.)

### 2. **React Query - Gestión de Datos del Servidor**
- **useQuery:** Para LEER datos (GET)
  - Caché automático (5 min por defecto)
  - Refetch automático cuando es necesario
  - Estados de loading/error sin useState
- **useMutation:** Para MODIFICAR datos (POST, PUT, DELETE)
  - Invalidación de caché automática
  - Optimistic updates
  - Manejo de errores consistente

### 3. **Zustand - Estado Global UI**
- Para estado UI que NO viene del servidor
- Ejemplos: modal abierto/cerrado, usuario seleccionado
- Mucho más simple que Redux (sin boilerplate)

### 4. **shadcn/ui - Componentes UI**
- NO es una librería NPM tradicional
- Los componentes se COPIAN a tu proyecto
- Control total sobre el código
- Basados en Radix UI (accesibilidad) + Tailwind CSS

### 5. **Validación con Zod + React Hook Form**
- Zod: Define esquemas de validación en TypeScript
- React Hook Form: Maneja formularios con performance
- Validación en tiempo real sin re-renders innecesarios

**Flujo de datos:**
```
Usuario → Componente → React Query Hook → Axios → Backend API
                    ↓
              Zustand Store (solo para UI)
```

**Ejemplo de código:**
```tsx
// Hook de React Query
const { data, isLoading, error } = useUsers({ page: 1, pageSize: 10 });

// Mutation para crear usuario
const createUser = useCreateUser();
await createUser.mutateAsync({ name: "Juan", email: "juan@test.com" });

// Store de Zustand
const { openDialog, closeDialog } = useUserStore();
```

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

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Lenguaje:** TypeScript
- **Data Fetching:** React Query (@tanstack/react-query)
- **Estado Global:** Zustand
- **Estilos:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Formularios:** React Hook Form
- **Validación:** Zod
- **HTTP Client:** Axios
- **Íconos:** Lucide React
- **Notificaciones:** Sonner (toast)

---

## 🛠️ Comandos Útiles para Desarrollo

### Backend

```bash
# Desarrollo
pnpm dev                    # Iniciar en modo desarrollo
pnpm build                  # Compilar para producción
pnpm start                  # Iniciar en producción

# Testing
pnpm test                   # Ejecutar todos los tests
pnpm test:watch            # Tests en modo watch
pnpm test:coverage         # Tests con cobertura
pnpm test:verbose          # Tests con salida detallada

# Base de datos
docker-compose up -d       # Iniciar MySQL
docker-compose down        # Detener MySQL
docker-compose logs -f     # Ver logs de Docker
```

### Frontend

```bash
# Desarrollo
pnpm dev                   # Iniciar en modo desarrollo
pnpm build                 # Build para producción
pnpm start                 # Iniciar en producción
pnpm lint                  # Ejecutar linter

# shadcn/ui
npx shadcn@latest add [component]  # Agregar nuevo componente
npx shadcn@latest add              # Ver componentes disponibles
```

### Monorepo

```bash
# Iniciar todo
# Terminal 1
cd backend && docker-compose up -d

# Terminal 2
cd backend && pnpm dev

# Terminal 3
cd frontend && pnpm dev

# Detener todo
pkill -f "ts-node-dev"     # Detener backend
pkill -f "next dev"        # Detener frontend
cd backend && docker-compose down  # Detener MySQL
```

---

## 📚 Documentación Adicional

### Backend
Dentro de `backend/` encontrarás documentación detallada:

- `README.md` - Guía completa del backend
- Documentación específica sobre arquitectura, CRUD, exportación, tests y Docker

### Frontend
Dentro de `frontend/` encontrarás:

- `README.md` - Guía completa del frontend
  - Tecnologías utilizadas (Next.js, React Query, Zustand, shadcn/ui)
  - Estructura del proyecto
  - Conceptos clave explicados
  - Cómo extender la aplicación
  - Recursos de aprendizaje

---

## 👨‍💻 Autor

**Desarrollador:** Jheyner David Ibagon 
**Prueba Técnica para:** Cymetria Group  
**Fecha:** Enero 2025

---

## 🎬 Demo de la Aplicación

### Funcionalidades del Frontend

**Página Principal:**
- 📋 Listado de usuarios con paginación (10 por página)
- 🔍 Información clara: total de usuarios, página actual, total de páginas
- ⚡ Loading states y manejo de errores
- 📱 Diseño responsive

**CRUD de Usuarios:**
- ➕ **Crear:** Modal con formulario validado (nombre, email)
- ✏️ **Editar:** Pre-carga de datos, validación en tiempo real
- 🗑️ **Eliminar:** Confirmación antes de borrar
- ✅ Notificaciones toast para cada acción

**Exportación:**
- 📥 Descarga de CSV con todos los usuarios
- ⏱️ Indicador de progreso durante la descarga
- 📊 Formato compatible con Excel

**Validación:**
- ✅ Nombre: mínimo 2 caracteres, máximo 100
- ✅ Email: formato válido, conversión a minúsculas
- ✅ Mensajes de error descriptivos en español

**UX:**
- 🎨 Interfaz moderna con shadcn/ui
- 🌈 Colores y tipografía consistentes
- ⚡ Transiciones suaves
- 🔄 Estados de loading claros
- ❌ Manejo de errores amigable

### Flujo de Uso

1. **Ver usuarios:** Al abrir la app, lista todos los usuarios paginados
2. **Crear nuevo:** Click en "Nuevo Usuario" → Llenar formulario → Crear
3. **Editar:** Click en ícono de lápiz → Modificar datos → Guardar
4. **Eliminar:** Click en ícono de basura → Confirmar → Eliminado
5. **Exportar:** Click en "Exportar CSV" → Descarga automática
6. **Navegar:** Botones "Anterior" / "Siguiente" para cambiar de página

---

## 📊 Resumen del Proyecto

### Tecnologías Implementadas
- **Backend:** Node.js + Express + TypeScript + Sequelize + MySQL
- **Frontend:** Next.js 15 + React 19 + TypeScript + React Query + Zustand
- **UI:** shadcn/ui + Tailwind CSS
- **Testing:** Jest + ts-jest
- **DevOps:** Docker + Docker Compose

### Líneas de Código
- **Backend:** ~2,500 líneas (sin contar node_modules)
- **Frontend:** ~1,500 líneas (sin contar node_modules)
- **Tests:** ~500 líneas
- **Documentación:** ~3,000 líneas

### Tiempo de Desarrollo
- Backend: Arquitectura, CRUD, tests, exportación
- Frontend: Configuración, componentes, integración
- Documentación: Guías detalladas para aprendizaje

### Cumplimiento de Requerimientos
- ✅ **CRUD completo** con paginación obligatoria
- ✅ **Exportación escalable** para 5K+ usuarios
- ✅ **12 tests unitarios** (servicios + repositorios)
- ✅ **Frontend completo** con UX moderna
- ✅ **Arquitectura hexagonal** correctamente implementada
- ✅ **Documentación pedagógica** detallada

---

## 🎯 Características Destacadas

### Backend
- **Arquitectura Hexagonal:** Dominio completamente aislado de frameworks
- **Paginación Inteligente:** Metadata completa (total, totalPages, etc.)
- **Export Escalable:** Streaming + caché + chunking para 5K+ usuarios
- **Validación Robusta:** Zod en todas las capas (HTTP y dominio)
- **Testing:** 12 tests unitarios con mocks correctos
- **Error Handling:** Middleware centralizado con respuestas consistentes

### Frontend
- **React Query:** Caché automático, refetch inteligente, estados de loading/error
- **Zustand:** Estado global simple sin boilerplate de Redux
- **shadcn/ui:** Componentes copiables y personalizables al 100%
- **Validación en Tiempo Real:** Zod + React Hook Form
- **UX Moderna:** Loading states, confirmaciones, notificaciones toast
- **TypeScript Estricto:** Type-safety completo en toda la app

### Integración
- **CORS Configurado:** Frontend y backend se comunican sin problemas
- **Variables de Entorno:** Configuración clara y documentada
- **Monorepo:** Organizado y fácil de navegar
- **Documentación:** Guías detalladas en backend y frontend

---

## 📝 Notas Técnicas

### General
- El proyecto usa **pnpm** como gestor de paquetes (backend y frontend)
- Monorepo organizado con documentación en cada carpeta
- Variables de entorno bien definidas y documentadas

### Backend
- La base de datos usa el puerto **3307** para evitar conflictos
- Los tests NO requieren base de datos (usan mocks)
- CORS configurado para `http://localhost:3001`
- La exportación soporta grandes volúmenes sin bloqueo

### Frontend
- Next.js usa el puerto **3001** (el 3000 está ocupado por el backend)
- Variables de entorno deben empezar con `NEXT_PUBLIC_` para ser accesibles
- Los componentes de shadcn/ui están en `components/ui/` y son editables
- React Query cachea datos por 5 minutos por defecto

---

## 🔧 Solución de Problemas Comunes

### Error: "EADDRINUSE: address already in use :::3000"
**Problema:** El puerto 3000 ya está en uso.

**Solución:**
```bash
# Encontrar el proceso
lsof -i :3000

# Detenerlo
kill -9 [PID]

# O reiniciar el backend
cd backend && pnpm dev
```

### Error: "ECONNREFUSED 127.0.0.1:3307"
**Problema:** MySQL no está corriendo.

**Solución:**
```bash
cd backend
docker-compose up -d
docker-compose logs -f mysql  # Ver logs
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Problema:** CORS no está configurado en el backend.

**Solución:**
- Verificar que `cors` esté instalado en el backend
- Verificar que `app.ts` tenga la configuración de CORS
- Reiniciar el backend después de agregar CORS

### Error: "Hydration mismatch" en el frontend
**Problema:** Extensiones del navegador modifican el HTML.

**Solución:**
- Abrir en modo incógnito
- O desactivar extensiones (ColorZilla, Grammarly, etc.)
- Este error **NO afecta** la funcionalidad

### Frontend no conecta con el backend
**Problema:** URL del backend incorrecta o backend no corriendo.

**Solución:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/v1/users?page=1&pageSize=10

# Verificar .env.local en frontend
cat frontend/.env.local
# Debe tener: NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Tests fallan
**Problema:** Dependencias no actualizadas o configuración incorrecta.

**Solución:**
```bash
# Backend
cd backend
pnpm install
pnpm test

# Frontend (si agregas tests en el futuro)
cd frontend
pnpm install
pnpm test
```

---

## ✅ Proyecto Completado

### Funcionalidades Implementadas

**Backend:**
- ✅ CRUD completo de usuarios con paginación
- ✅ Exportación escalable a CSV (5K+ usuarios)
- ✅ Arquitectura hexagonal completa
- ✅ 12 tests unitarios (Jest)
- ✅ Validación con Zod
- ✅ Manejo de errores centralizado
- ✅ Docker para MySQL

**Frontend:**
- ✅ Interfaz moderna con Next.js 15
- ✅ Listado paginado de usuarios
- ✅ CRUD completo con validación
- ✅ Exportación a CSV
- ✅ React Query para caché automático
- ✅ Zustand para estado global
- ✅ shadcn/ui para componentes UI
- ✅ Responsive design



