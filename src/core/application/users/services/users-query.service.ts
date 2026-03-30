import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/users/dtos/user.dto";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";

export interface UsersQueryService {
  search(query: ListUsersQuery): Promise<Paginated<UserDto>>;
  findById(query: GetUserQuery): Promise<UserDto | null>;
}
