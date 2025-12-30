import { UserRepository } from "../../../../domain/ports/UserRepository";
import { User } from "../../../../domain/entities/User";
import { PaginatedResult, PaginationParams } from "../../../../domain/types/Pagination";
import { UserModel } from "../models/user.model";

export class UserRepositorySequelize implements UserRepository {
	/**
	 * Busca todos los usuarios con paginación
	 */
	async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
		const { page, pageSize } = params;
		const offset = (page - 1) * pageSize;

		// findAndCountAll ejecuta 2 queries: una para contar, otra para obtener datos
		const { rows, count } = await UserModel.findAndCountAll({
			limit: pageSize,
			offset: offset,
			order: [["createdAt", "DESC"]], // Orden determinístico requerido
		});

		// Mapeo de modelo de persistencia → entidad de dominio
		const users = rows.map(
			(u) => new User(u.name, u.email, u.id, u.createdAt, u.updatedAt)
		);

		return {
			data: users,
			page,
			pageSize,
			total: count,
			totalPages: Math.ceil(count / pageSize),
		};
	}

	/**
	 * Busca un usuario por ID
	 */
	async findById(id: string): Promise<User | null> {
		const user = await UserModel.findByPk(id);
		return user ? new User(user.name, user.email, user.id, user.createdAt, user.updatedAt) : null;
	}

	/**
	 * Crea un nuevo usuario
	 */
	async save(user: User): Promise<User> {
		const created = await UserModel.create({
			name: user.name,
			email: user.email,
		});

		return new User(
			created.name,
			created.email,
			created.id,
			created.createdAt,
			created.updatedAt
		);
	}

	/**
	 * Actualiza un usuario existente
	 */
	async update(id: string, userData: Partial<User>): Promise<User | null> {
		const user = await UserModel.findByPk(id);
		
		if (!user) {
			return null;
		}

		// Actualiza solo los campos proporcionados
		await user.update({
			...(userData.name && { name: userData.name }),
			...(userData.email && { email: userData.email }),
		});

		// Recarga para obtener updatedAt fresco
		await user.reload();

		return new User(user.name, user.email, user.id, user.createdAt, user.updatedAt);
	}

	/**
	 * Elimina un usuario
	 */
	async delete(id: string): Promise<boolean> {
		const user = await UserModel.findByPk(id);
		
		if (!user) {
			return false;
		}

		await user.destroy();
		return true;
	}

	/**
	 * Busca un usuario por email
	 */
	async findByEmail(email: string): Promise<User | null> {
		const user = await UserModel.findOne({ where: { email } });
		return user ? new User(user.name, user.email, user.id, user.createdAt, user.updatedAt) : null;
	}
}
