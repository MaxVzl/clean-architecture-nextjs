import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/users/dtos/user.dto";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";

export interface UsersQueryService {
  find(query: ListUsersQuery): Promise<Paginated<UserDto>>;
  findById(id: string): Promise<UserDto | null>;
}
