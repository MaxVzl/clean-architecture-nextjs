import { CreateUserUseCase } from "@/core/application/users/use-cases/create-users.use-case";
import { GetUsersUseCase } from "@/core/application/users/use-cases/get-users.use-case";
import { InMemoryUsersRepository } from "@/core/infrastructure/users/repositories/in-memory-users.repository";

export const inMemoryUsersRepository = new InMemoryUsersRepository();

export const getUsersUseCase = new GetUsersUseCase({
  usersRepository: inMemoryUsersRepository,
});
export const createUserUseCase = new CreateUserUseCase({
  usersRepository: inMemoryUsersRepository,
});
