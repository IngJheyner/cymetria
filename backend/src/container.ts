import { container } from "tsyringe";
import { UserRepository } from "./domain/ports/UserRepository";
import { UserRepositorySequelize } from "./infrastructure/db/sequelize/repositories/UserRepositorySequelize";

container.register<UserRepository>("UserRepository", {
	useClass: UserRepositorySequelize,
});
