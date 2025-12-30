import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { container } from "tsyringe";

/**
 * Controlador de Usuarios
 */

const userService = container.resolve(UserService);

export class UserController {
	/**
	 * GET /api/v1/users?page=1&pageSize=10
	 */
	async getAllUsers(req: Request, res: Response) {
		// Extraer parámetros de query con valores por defecto
		const page = parseInt(req.query.page as string) || 1;
		const pageSize = parseInt(req.query.pageSize as string) || 10;

		// Delegar al servicio
		const result = await userService.getAllUsers({ page, pageSize });

		// Respuesta estructurada según requerimientos
		res.json(result);
	}

	/**
	 * GET /api/v1/users/:id
	 * 
	 * Obtiene un usuario específico por ID
	 */
	async getUserById(req: Request, res: Response) {
		const { id } = req.params;

		const user = await userService.getUserById(id);

		res.json({ ok: true, user });
	}

	/**
	 * POST /api/v1/users
	 * 
	 * Crea un nuevo usuario
	 * 
	 * Body:
	 * {
	 *   "name": "John Doe",
	 *   "email": "john@example.com"
	 * }
	 */
	async createUser(req: Request, res: Response) {
		const { name, email } = req.body;

		const user = await userService.createUser({ name, email });

		// 201 Created es el código apropiado para recursos creados
		res.status(201).json({ ok: true, user });
	}

	/**
	 * PUT /api/v1/users/:id
	 * 
	 * Actualiza un usuario existente (parcial o completo)
	 * 
	 * Body (ambos campos opcionales, al menos uno requerido):
	 * {
	 *   "name": "Jane Doe",
	 *   "email": "jane@example.com"
	 * }
	 */
	async updateUser(req: Request, res: Response) {
		const { id } = req.params;
		const { name, email } = req.body;

		const user = await userService.updateUser(id, { name, email });

		res.json({ ok: true, user });
	}

	/**
	 * DELETE /api/v1/users/:id
	 * 
	 * Elimina un usuario
	 * 
	 * Responde 204 No Content (sin cuerpo) según convención REST
	 */
	async deleteUser(req: Request, res: Response) {
		const { id } = req.params;

		await userService.deleteUser(id);

		// 204 No Content: operación exitosa sin contenido que devolver
		res.status(204).send();
	}
}
