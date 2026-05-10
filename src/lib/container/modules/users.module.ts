import { CacheService } from "@/core/application/common/services/cache.service";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";
import { CreateUserUseCase } from "@/core/application/users/use-cases/create-user.use-case";
import { GetUserUseCase } from "@/core/application/users/use-cases/get-user.use-case";
import { ListUsersUseCase } from "@/core/application/users/use-cases/list-users.use-case";
import { UsersRepository } from "@/core/domain/users/repositories/users.repository";

export type UsersModuleDeps = {
  usersRepository: UsersRepository;
  usersQueryService: UsersQueryService;
  cacheService: CacheService;
};

export function createUsersModule(deps: UsersModuleDeps) {
  return {
    getUserUseCase: new GetUserUseCase({
      usersQueryService: deps.usersQueryService,
      cacheService: deps.cacheService,
    }),
    listUsersUseCase: new ListUsersUseCase({
      usersQueryService: deps.usersQueryService,
    }),
    createUserUseCase: new CreateUserUseCase({
      usersRepository: deps.usersRepository,
    }),
  };
}
