import { UserRepository } from "../../../domain/ports/UserRepository";
import { User } from "../../../domain/entities/User";
import { PaginatedResult, PaginationParams } from "../../../domain/types/Pagination";
import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";

/**
 * Servicio de Aplicación para Usuarios
 */
@injectable()
export class UserService {
	constructor(
		@inject("UserRepository")
		private readonly userRepository: UserRepository
	) {}

	/**
	 * Obtiene usuarios paginados
	 */
	async getAllUsers(params: PaginationParams): Promise<PaginatedResult<User>> {
		// Validación de reglas de negocio
		if (params.page < 1) {
			throw new HttpException(400, "Page must be greater than 0");
		}
		if (params.pageSize < 1 || params.pageSize > 100) {
			throw new HttpException(400, "PageSize must be between 1 and 100");
		}

		return this.userRepository.findAll(params);
	}

	/**
	 * Obtiene un usuario por ID
	 */
	async getUserById(id: string): Promise<User> {
		if (!id || id.trim() === "") {
			throw new HttpException(400, "User ID is required");
		}

		const user = await this.userRepository.findById(id);
		
		if (!user) {
			throw new HttpException(404, `User with ID ${id} not found`);
		}

		return user;
	}

	/**
	 * Crea un nuevo usuario
	 * 
	 * Validaciones:
	 * 1. Campos requeridos (name, email)
	 * 2. Formato de email básico
	 * 3. Email único (regla de negocio)
	 */
	async createUser(userData: Partial<User>): Promise<User> {
		// Validación de campos requeridos
		if (!userData.name || !userData.email) {
			throw new HttpException(400, "Name and email are required");
		}

		// Validación de formato de email (básica)
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userData.email)) {
			throw new HttpException(400, "Invalid email format");
		}

		// Regla de negocio: email debe ser único
		const existingUser = await this.userRepository.findByEmail(userData.email);
		if (existingUser) {
			throw new HttpException(409, "User with this email already exists");
		}

		// Crear entidad del dominio
		const user = new User(userData.name, userData.email);
		
		return this.userRepository.save(user);
	}

	/**
	 * Actualiza un usuario existente
	 * 
	 * ¿Por qué permitir actualizaciones parciales?
	 * - RESTful: PUT completo vs PATCH parcial
	 * - Flexibilidad: actualizar solo name o solo email
	 * 
	 * Validaciones:
	 * 1. Al menos un campo para actualizar
	 * 2. Si se actualiza email, validar formato
	 * 3. Si se actualiza email, verificar que no esté en uso
	 */
	async updateUser(id: string, userData: Partial<User>): Promise<User> {
		if (!id || id.trim() === "") {
			throw new HttpException(400, "User ID is required");
		}

		// Debe haber al menos un campo para actualizar
		if (!userData.name && !userData.email) {
			throw new HttpException(400, "At least one field (name or email) is required");
		}

		// Si se actualiza el email, validar formato
		if (userData.email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userData.email)) {
				throw new HttpException(400, "Invalid email format");
			}

			// Verificar que el email no esté en uso por otro usuario
			const existingUser = await this.userRepository.findByEmail(userData.email);
			if (existingUser && existingUser.id !== id) {
				throw new HttpException(409, "Email already in use by another user");
			}
		}

		const updatedUser = await this.userRepository.update(id, userData);

		if (!updatedUser) {
			throw new HttpException(404, `User with ID ${id} not found`);
		}

		return updatedUser;
	}

	/**
	 * Elimina un usuario
	 * 
	 * ¿Por qué no devolver el usuario eliminado?
	 * - REST: DELETE generalmente responde 204 No Content
	 * - El cliente ya tiene el ID, no necesita más info
	 * 
	 * ¿Soft delete vs hard delete?
	 * - Actualmente: hard delete (elimina físicamente)
	 * - Futuro: podrías agregar un campo "deletedAt" para soft delete
	 */
	async deleteUser(id: string): Promise<void> {
		if (!id || id.trim() === "") {
			throw new HttpException(400, "User ID is required");
		}

		const deleted = await this.userRepository.delete(id);

		if (!deleted) {
			throw new HttpException(404, `User with ID ${id} not found`);
		}
	}
}
