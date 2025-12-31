import { Router } from "express";
import { UserController } from "../../controllers/user.controller";
import { container } from "tsyringe";
import { withTryCatch } from "../../../../decorators/withTryCatch";
import { validate } from "../../middlewares/validate.middleware";
import {
	createUserSchema,
	updateUserSchema,
	paginationSchema,
	uuidSchema,
} from "../../validators/user.validator";

/**
 * Rutas de usuarios - Versión 1
 * 
 * ¿Por qué versionamiento?
 * - Permite evolucionar la API sin romper clientes existentes
 * - v1, v2, v3... pueden coexistir
 * 
 * Middlewares en cadena:
 * 1. validate(): Valida y transforma los datos de entrada
 * 2. withTryCatch(): Captura errores asíncronos
 * 3. controller: Procesa la petición
 * 
 * El orden importa: validar antes de procesar
 */

const router = Router();
const userController = container.resolve(UserController);

/**
 * CRUD completo de usuarios con validación
 * 
 * GET    /api/v1/users          → Lista usuarios (paginado)
 * GET    /api/v1/users/export   → Exporta todos los usuarios a CSV
 * GET    /api/v1/users/:id      → Obtiene un usuario
 * POST   /api/v1/users          → Crea un usuario
 * PUT    /api/v1/users/:id      → Actualiza un usuario
 * DELETE /api/v1/users/:id      → Elimina un usuario
 */

// Exportar usuarios a CSV (DEBE ir ANTES de /:id para evitar conflicto)
router.get(
	"/export",
	withTryCatch(userController.exportUsers.bind(userController))
);

// Listar usuarios con paginación
router.get(
	"/",
	validate(paginationSchema, "query"), // Valida query params (page, pageSize)
	withTryCatch(userController.getAllUsers.bind(userController))
);

// Obtener usuario por ID
router.get(
	"/:id",
	validate(uuidSchema, "params"), // Valida que :id sea un UUID válido
	withTryCatch(userController.getUserById.bind(userController))
);

// Crear usuario
router.post(
	"/",
	validate(createUserSchema, "body"), // Valida body (name, email)
	withTryCatch(userController.createUser.bind(userController))
);

// Actualizar usuario
router.put(
	"/:id",
	validate(uuidSchema, "params"), // Valida :id
	validate(updateUserSchema, "body"), // Valida body (name?, email?)
	withTryCatch(userController.updateUser.bind(userController))
);

// Eliminar usuario
router.delete(
	"/:id",
	validate(uuidSchema, "params"), // Valida :id
	withTryCatch(userController.deleteUser.bind(userController))
);

export default router;
