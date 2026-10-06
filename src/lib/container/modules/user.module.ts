import { UserReadModel } from "@/core/application/user/read-models/user.read-model";
import { CreateUserUseCase } from "@/core/application/user/use-cases/create-user.use-case";
import { UserRepository } from "@/core/domain/user/repositories/user.repository";
import { UserController } from "@/core/presentation/controllers/user.controller";

export type UserModuleDeps = {
  userRepository: UserRepository;
  userReadModel: UserReadModel;
};

export const createUserModule = (deps: UserModuleDeps) => ({
  userReadModel: deps.userReadModel,
  userController: new UserController({
    userReadModel: deps.userReadModel,
  }),
  createUserUseCase: new CreateUserUseCase({
    userRepository: deps.userRepository,
  }),
});
