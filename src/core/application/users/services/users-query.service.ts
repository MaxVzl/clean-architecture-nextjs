import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/users/dtos/user.dto";
import { UserQueryFilter } from "@/core/application/users/filters/user-query.filter";

export interface UsersQueryService {
  find(filter: UserQueryFilter): Promise<Paginated<UserDto>>;
  findById(id: string): Promise<UserDto | null>;
}
