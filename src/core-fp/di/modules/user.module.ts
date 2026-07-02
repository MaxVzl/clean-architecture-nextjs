import { UsersRepository } from "@/core-fp/domain/user/repositories/users.repository";
import { makeCreateUserUseCase } from "@/core-fp/application/user/use-cases/create-user.use-case";
import { UsersQueryService } from "@/core-fp/application/user/services/users-query.service";

export type UserModuleDeps = {
  usersRepository: UsersRepository;
  usersQueryService: UsersQueryService;
};

export function createUserModule(deps: UserModuleDeps) {
  return {
    createUserUseCase: makeCreateUserUseCase({
      usersRepository: deps.usersRepository,
    }),
    usersQueryService: deps.usersQueryService,
  };
}
