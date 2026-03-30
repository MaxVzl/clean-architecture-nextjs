import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UserNotFoundError } from "@/core/domain/users/errors/user-not-found.error";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";

export interface GetUserUseCaseDeps {
  usersQueryService: UsersQueryService;
}

export class GetUserUseCase extends UseCase<
  GetUserUseCaseDeps,
  UserDto,
  GetUserQuery
> {
  async execute(query: GetUserQuery): Promise<UserDto> {
    const user = await this.deps.usersQueryService.findById(query);
    if (!user) {
      throw new UserNotFoundError({ identifier: query.id });
    }
    return user;
  }
}
