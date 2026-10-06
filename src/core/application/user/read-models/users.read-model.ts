import { PaginatedDto } from "@/core/application/common/dtos/paginated.dto";
import { UserDto } from "@/core/application/user/dtos/user.dto";
import { ListUserQuery } from "@/core/application/user/queries/list-user.query";

export interface UsersQueryService {
  find(query: ListUserQuery): Promise<PaginatedDto<UserDto>>;
  findById(id: string): Promise<UserDto | null>;
}
