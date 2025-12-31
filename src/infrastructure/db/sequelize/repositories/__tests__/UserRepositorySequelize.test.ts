import "reflect-metadata"; // Requerido por TSyringe
import { UserRepositorySequelize } from "../UserRepositorySequelize";
import { UserModel } from "../../models/user.model";
import { User } from "../../../../../domain/entities/User";

/**
 * Tests del UserRepositorySequelize (Adaptador con Mocks)
 */

// Mock del modelo de Sequelize
jest.mock("../../models/user.model");

describe("UserRepositorySequelize", () => {
  let repository: UserRepositorySequelize;

  beforeEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();

    // Crear instancia del repositorio
    repository = new UserRepositorySequelize();
  });

  /**
   * Test Suite 1: findAll (Paginación)
   */
  describe("findAll", () => {
    it("debe retornar usuarios paginados con metadata correcta", async () => {
      // Arrange: Simular datos de Sequelize
      const mockUsers = [
        {
          id: "uuid-1",
          name: "Juan",
          email: "juan@test.com",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
        {
          id: "uuid-2",
          name: "María",
          email: "maria@test.com",
          createdAt: new Date("2024-01-02"),
          updatedAt: new Date("2024-01-02"),
        },
      ];

      const mockSequelizeResponse = {
        rows: mockUsers,
        count: 25, // Total en BD
      };

      // Mock del método estático de Sequelize
      (UserModel.findAndCountAll as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockSequelizeResponse);

      // Act
      const result = await repository.findAll({ page: 1, pageSize: 10 });

      // Assert: Verificar estructura de respuesta
      expect(result).toEqual({
        data: [
          new User("Juan", "juan@test.com", "uuid-1", mockUsers[0].createdAt, mockUsers[0].updatedAt),
          new User("María", "maria@test.com", "uuid-2", mockUsers[1].createdAt, mockUsers[1].updatedAt),
        ],
        page: 1,
        pageSize: 10,
        total: 25,
        totalPages: 3, // Math.ceil(25 / 10)
      });

      // Verificar query a Sequelize
      expect(UserModel.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0, // (page - 1) * pageSize = (1 - 1) * 10
        order: [["createdAt", "DESC"]],
      });
    });

    it("debe calcular el offset correctamente para páginas distintas", async () => {
      // Arrange
      (UserModel.findAndCountAll as jest.Mock) = jest.fn().mockResolvedValue({
        rows: [],
        count: 0,
      });

      // Act: Página 3 con tamaño 20
      await repository.findAll({ page: 3, pageSize: 20 });

      // Assert: offset debe ser (3-1) * 20 = 40
      expect(UserModel.findAndCountAll).toHaveBeenCalledWith({
        limit: 20,
        offset: 40,
        order: [["createdAt", "DESC"]],
      });
    });

    it("debe mapear correctamente UserModel a User (entidad del dominio)", async () => {
      // Arrange
      const mockUserData = {
        id: "uuid-123",
        name: "Test User",
        email: "test@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (UserModel.findAndCountAll as jest.Mock) = jest.fn().mockResolvedValue({
        rows: [mockUserData],
        count: 1,
      });

      // Act
      const result = await repository.findAll({ page: 1, pageSize: 10 });

      // Assert: Debe ser instancia de User (entidad), no UserModel
      expect(result.data[0]).toBeInstanceOf(User);
      expect(result.data[0].id).toBe("uuid-123");
      expect(result.data[0].name).toBe("Test User");
      expect(result.data[0].email).toBe("test@test.com");
    });
  });

  /**
   * Test Suite 2: findById
   */
  describe("findById", () => {
    it("debe retornar un usuario cuando existe", async () => {
      // Arrange
      const mockUserData = {
        id: "uuid-123",
        name: "Juan",
        email: "juan@test.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (UserModel.findByPk as jest.Mock) = jest.fn().mockResolvedValue(mockUserData);

      // Act
      const result = await repository.findById("uuid-123");

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe("uuid-123");
      expect(result?.name).toBe("Juan");
      expect(UserModel.findByPk).toHaveBeenCalledWith("uuid-123");
    });

    it("debe retornar null cuando el usuario no existe", async () => {
      // Arrange
      (UserModel.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null);

      // Act
      const result = await repository.findById("uuid-999");

      // Assert
      expect(result).toBeNull();
    });
  });
});

