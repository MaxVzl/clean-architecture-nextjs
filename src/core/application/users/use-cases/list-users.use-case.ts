import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";
import { Paginated } from "@/core/application/common/paginated.base";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";

export interface ListUsersUseCaseDeps {
  usersQueryService: UsersQueryService;
}

export class ListUsersUseCase extends UseCase<
  ListUsersUseCaseDeps,
  Paginated<UserDto>,
  ListUsersQuery
> {
  async execute(query: ListUsersQuery): Promise<Paginated<UserDto>> {
    return this.deps.usersQueryService.search(query);
  }
}
