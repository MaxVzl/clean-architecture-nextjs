import { CacheService } from "@/core/application/common/services/cache.service";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { CreateUserUseCase } from "@/core/application/user/use-cases/create-user.use-case";
import { GetUserUseCase } from "@/core/application/user/use-cases/get-user.use-case";
import { ListUserUseCase } from "@/core/application/user/use-cases/list-user.use-case";
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
    listUserUseCase: new ListUserUseCase({
      usersQueryService: deps.usersQueryService,
    }),
    createUserUseCase: new CreateUserUseCase({
      usersRepository: deps.usersRepository,
    }),
  };
}
