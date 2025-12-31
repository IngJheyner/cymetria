import "reflect-metadata"; // Requerido por TSyringe
import { UserService } from "../user.service";
import { UserRepository } from "../../../../domain/ports/UserRepository";
import { User } from "../../../../domain/entities/User";
import { HttpException } from "../../errors/HttpException";

/**
 * Tests del UserService (Caso de Uso / Servicio de Aplicación)
 */

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  // Setup: Se ejecuta antes de cada test
  beforeEach(() => {
    // Crear mock del repositorio con todos sus métodos
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    };

    // Crear instancia del servicio con el repositorio mockeado
    userService = new UserService(mockUserRepository);
  });

  /**
   * Test Suite 1: getAllUsers (Paginación)
   */
  describe("getAllUsers", () => {
    it("debe retornar usuarios paginados cuando los parámetros son válidos", async () => {
      // Arrange: Preparar datos
      const mockResult = {
        data: [
          new User("Juan", "juan@test.com", "uuid-1"),
          new User("María", "maria@test.com", "uuid-2"),
        ],
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      };

      mockUserRepository.findAll.mockResolvedValue(mockResult);

      // Act: Ejecutar acción
      const result = await userService.getAllUsers({ page: 1, pageSize: 10 });

      // Assert: Verificar resultados
      expect(result).toEqual(mockResult);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("debe lanzar error cuando page es menor a 1", async () => {
      // Act & Assert
      await expect(
        userService.getAllUsers({ page: 0, pageSize: 10 })
      ).rejects.toThrow(HttpException);

      await expect(
        userService.getAllUsers({ page: 0, pageSize: 10 })
      ).rejects.toThrow("La página debe ser mayor a 0");

      // Verificar que NO se llamó al repositorio
      expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });

    it("debe lanzar error cuando pageSize es menor a 1", async () => {
      await expect(
        userService.getAllUsers({ page: 1, pageSize: 0 })
      ).rejects.toThrow("El tamaño de la página debe ser entre 1 y 100");
    });

    it("debe lanzar error cuando pageSize es mayor a 100", async () => {
      await expect(
        userService.getAllUsers({ page: 1, pageSize: 101 })
      ).rejects.toThrow("El tamaño de la página debe ser entre 1 y 100");
    });
  });

  /**
   * Test Suite 2: getUserById
   */
  describe("getUserById", () => {
    it("debe retornar un usuario cuando existe", async () => {
      // Arrange
      const mockUser = new User("Juan", "juan@test.com", "uuid-123");
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById("uuid-123");

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith("uuid-123");
    });

    it("debe lanzar error 404 cuando el usuario no existe", async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById("uuid-999")).rejects.toThrow(
        HttpException
      );

      await expect(userService.getUserById("uuid-999")).rejects.toThrow(
        "Usuario con ID uuid-999 no encontrado"
      );
    });

    it("debe lanzar error cuando el ID está vacío", async () => {
      await expect(userService.getUserById("")).rejects.toThrow(
        "ID de usuario requerido"
      );

      // No debe llamar al repositorio
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });
});

