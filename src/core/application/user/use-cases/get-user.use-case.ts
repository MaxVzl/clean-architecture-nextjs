import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UserNotFoundError } from "@/core/domain/users/errors/user-not-found.error";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { CacheService } from "@/core/application/common/services/cache.service";

export interface GetUserUseCaseDeps {
  usersQueryService: UsersQueryService;
  cacheService: CacheService;
}

export class GetUserUseCase extends UseCase<
  GetUserUseCaseDeps,
  UserDto,
  string
> {
  async execute(id: string): Promise<UserDto> {
    const user = await this.deps.cacheService.getOrSet(
      `user:${id}`,
      () => this.deps.usersQueryService.findById(id),
      60 * 60 * 24,
    );
    if (!user) {
      throw new UserNotFoundError({ identifier: id });
    }
    return user;
  }
}
