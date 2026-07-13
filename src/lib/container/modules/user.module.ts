import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { CreateUserUseCase } from "@/core/application/user/use-cases/create-user.use-case";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { UserController } from "@/core/presentation/controllers/user.controller";

export type UserModuleDeps = {
  usersRepository: UsersRepository;
  usersQueryService: UsersQueryService;
};

export function createUserModule(deps: UserModuleDeps) {
  return {
    usersQueryService: deps.usersQueryService,
    userController: new UserController({
      usersQueryService: deps.usersQueryService,
    }),
    createUserUseCase: new CreateUserUseCase({
      usersRepository: deps.usersRepository,
    }),
  };
}
