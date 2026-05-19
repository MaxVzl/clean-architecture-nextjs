import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Paginated } from "@/core/application/common/paginated.base";
import { ListUserQuery } from "@/core/application/user/queries/list-user.query";

export interface ListUserUseCaseDeps {
  usersQueryService: UsersQueryService;
}

export class ListUserUseCase extends UseCase<
  ListUserUseCaseDeps,
  Paginated<UserDto>,
  ListUserQuery
> {
  async execute(query: ListUserQuery): Promise<Paginated<UserDto>> {
    return this.deps.usersQueryService.find(query);
  }
}
