import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UserNotFoundError } from "@/core/domain/users/errors/user-not-found.error";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";

export interface GetUserUseCaseDeps {
  usersQueryService: UsersQueryService;
}

export class GetUserUseCase extends UseCase<
  GetUserUseCaseDeps,
  UserDto,
  string
> {
  async execute(id: string): Promise<UserDto> {
    const user = await this.deps.usersQueryService.findById(id);
    if (!user) {
      throw new UserNotFoundError({ identifier: id });
    }
    return user;
  }
}
