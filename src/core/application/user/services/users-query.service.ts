import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/user/dtos/user.dto";
import { ListUserQuery } from "@/core/application/user/queries/list-user.query";

export interface UsersQueryService {
  find(query: ListUserQuery): Promise<Paginated<UserDto>>;
  findById(id: string): Promise<UserDto | null>;
}
