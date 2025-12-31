import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { HttpException } from "../errors/HttpException";

/**
 * Tipos de validación según la fuente de datos
 * - body: req.body (POST, PUT, PATCH)
 * - query: req.query (GET con parámetros)
 * - params: req.params (URL params como /users/:id)
 */
type ValidationSource = "body" | "query" | "params";

/**
 * Middleware genérico de validación con Zod
 * 
 * ¿Por qué un middleware reutilizable?
 * - DRY: No repetir lógica de validación
 * - Consistencia: Todos los endpoints validan igual
 * - Mensajes claros: Errores estructurados para el frontend
 * 
 * ¿Cómo funciona?
 * 1. Recibe un esquema de Zod
 * 2. Valida la fuente de datos especificada (body, query, params)
 * 3. Si es válido, reemplaza los datos originales con los validados/transformados
 * 4. Si falla, lanza HttpException con detalles del error
 * 
 * Ejemplo de uso:
 * router.post('/', validate(createUserSchema, 'body'), controller.create)
 */
export const validate = (schema: ZodSchema, source: ValidationSource = "body") => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Valida y transforma los datos según el esquema
			const validated = await schema.parseAsync(req[source]);

			// Reemplaza los datos originales con los validados/transformados
			// Ejemplo: email se convierte a lowercase, espacios se eliminan, etc.
			req[source] = validated;

			next();
		} catch (error) {
			// Si Zod encuentra errores, los formatea y lanza excepción HTTP
			if (error instanceof z.ZodError) {
				const errors = error.issues.map((issue: z.ZodIssue) => ({
					field: issue.path.join("."),
					message: issue.message,
				}));

				// 400 Bad Request con detalles de validación
				next(
					new HttpException(400, "Validation failed", {
						errors,
					})
				);
			} else {
				next(error);
			}
		}
	};
};

