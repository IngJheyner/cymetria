import { z } from "zod";

/**
 * Esquemas de validación con Zod
 */
export const createUserSchema = z.object({
	name: z
		.string({ message: "Name must be a string" })
		.min(2, { message: "Name must be at least 2 characters" })
		.max(100, { message: "Name must not exceed 100 characters" })
		.trim(), // Elimina espacios al inicio y final

	email: z
		.string({ message: "Email must be a string" })
		.email({ message: "Invalid email format" })
		.toLowerCase() // Normaliza a minúsculas
		.trim(),
});

/**
 * Esquema para actualizar usuario
 * - Ambos campos son opcionales (actualizaciones parciales)
 * - Pero al menos uno debe estar presente
 */
export const updateUserSchema = z
	.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(100, "Name must not exceed 100 characters")
			.trim()
			.optional(),

		email: z
			.string()
			.email("Invalid email format")
			.toLowerCase()
			.trim()
			.optional(),
	})
	.refine((data) => data.name || data.email, {
		message: "At least one field (name or email) must be provided",
	});

/**
 * Esquema para validar parámetros de paginación
 * - page: número positivo, default 1
 * - pageSize: entre 1 y 100, default 10
 */
export const paginationSchema = z.object({
	page: z
		.string()
		.optional()
		.default("1")
		.transform((val) => parseInt(val, 10))
		.refine((val) => val > 0, "Page must be greater than 0"),

	pageSize: z
		.string()
		.optional()
		.default("10")
		.transform((val) => parseInt(val, 10))
		.refine((val) => val >= 1 && val <= 100, "PageSize must be between 1 and 100"),
});

/**
 * Esquema para validar UUID
 * Usado en params de URL (/users/:id)
 */
export const uuidSchema = z.object({
	id: z.string().uuid("Invalid user ID format"),
});

// Exportar tipos inferidos de Zod para usar en TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

