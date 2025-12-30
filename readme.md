```
# 🚀 Hexagonal Express API - TypeScript

Este proyecto está diseñado con una **arquitectura hexagonal (Ports and Adapters)** usando **Express.js** y **TypeScript**, con una estructura limpia, escalable y desacoplada.

---

## 📁 Estructura del proyecto


src/
├── app.ts # Clase que inicializa el servidor Express
├── index.ts # Punto de entrada del proyecto
├── config/ # Configuraciones globales (base de datos, entorno, etc.)
├── decorators/ # Funciones de orden superior (validación, try/catch, etc.)
├── domain/ # Lógica de negocio pura (entidades y puertos)
│ ├── entities/ # Entidades (ej: User, Product)
│ └── ports/ # Interfaces para servicios y repositorios
├── infrastructure/ # Adaptadores al mundo exterior
│ ├── db/ # Repositorios para MySQL, PostgreSQL o MongoDB
│ │ ├── mysql/
│ │ ├── postgres/
│ │ └── mongodb/
│ └── http/
│ ├── controllers/ # Lógica de controladores Express (usa puertos)
│ ├── middlewares/ # Middlewares globales o por ruta
│ ├── routes/
│ │ └── v1/ # Rutas versionadas (v1, v2, etc.)
│ └── services/ # Implementaciones concretas de los puertos (ej: GreetingServiceImpl)
└── tsconfig.json # Configuración de TypeScript


```

---

## 🧱 Arquitectura hexagonal en acción

Esta arquitectura separa la aplicación en tres grandes capas:

| Capa              | Descripción                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `domain/`         | Contiene entidades del negocio e interfaces (`ports`) independientes del framework |
| `infrastructure/` | Implementa las interfaces del dominio y se conecta con el mundo externo (HTTP, DB) |
| `app.ts`          | Carga middlewares, rutas y levanta el servidor Express                             |

---

## 🧪 Ejemplo de flujo (`GET /api/v1/hello`)

1. El router en `routes/v1/hello.route.ts` recibe la petición.
2. Llama al controlador `hello.controller.ts`.
3. El controlador usa el servicio `GreetingServiceImpl`.
4. Este servicio implementa la interfaz `GreetingService` definida en `domain/ports/`.

---

## 🧪 Ejemplo real de entidad `User`

-   `User` está definido como clase en `domain/entities/User.ts`
-   `UserRepository` define las operaciones necesarias en `domain/ports/UserRepository.ts`
-   `UserServiceImpl` implementa esa interfaz en `infrastructure/http/services/UserServiceImpl.ts`
-   `UserController` consume ese servicio en `controllers/user.controller.ts`
-   Las rutas están en `routes/v1/user.route.ts`

---

## 🚀 Scripts disponibles

En tu `package.json`:

```

"scripts": {
"dev": "ts-node-dev --respawn --transpile-only src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"clean": "rm -rf dist"
}

```

### Cómo usarlos:

-   `npm run dev`: Ejecuta en modo desarrollo con recarga automática.
-   `npm run build`: Compila TypeScript a `dist/`.
-   `npm run start`: Corre el proyecto ya compilado (producción).
-   `npm run clean`: Borra la carpeta `dist`.

---

## 🌐 Versionamiento de la API

Todas las rutas están organizadas por versión:

```

GET /api/v1/hello
GET /api/v1/users

```

También podés implementar **versionamiento avanzado por headers** usando un middleware.

---

## ✅ Futuras extensiones

-   Conexión real a MongoDB, MySQL o PostgreSQL
-   Autenticación JWT
-   Validación de datos con Zod o Joi
-   Documentación con Swagger
-   Testing con Jest + Supertest

---

## 🧠 Recomendaciones

-   Cada carpeta representa una responsabilidad clara.
-   Las dependencias apuntan **de afuera hacia adentro**: controllers llaman a servicios que implementan puertos.
-   El dominio **no depende** de Express, ni de la base de datos.

---

## 🧑‍💻 Autor

Desarrollado por **Leonardo** 💜 con arquitectura hexagonal + TypeScript + Express.

---

## 📜 Licencia

MIT
