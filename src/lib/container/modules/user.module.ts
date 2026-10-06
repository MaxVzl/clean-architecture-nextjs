import { UsersReadModel } from "@/core/application/user/read-models/users.read-model";
import { CreateUserUseCase } from "@/core/application/user/use-cases/create-user.use-case";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { UserController } from "@/core/presentation/controllers/user.controller";

export type UserModuleDeps = {
  usersRepository: UsersRepository;
  usersReadModel: UsersReadModel;
};

export const createUserModule = (deps: UserModuleDeps) => ({
  usersReadModel: deps.usersReadModel,
  userController: new UserController({
    usersReadModel: deps.usersReadModel,
  }),
  createUserUseCase: new CreateUserUseCase({
    usersRepository: deps.usersRepository,
  }),
});
