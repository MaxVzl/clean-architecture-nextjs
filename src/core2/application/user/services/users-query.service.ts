import { PaginatedDto } from "@/core2/application/common/dtos/paginated.dto";
import { UserDto } from "@/core2/application/user/dtos/user.dto";
import { ListUserQuery } from "@/core2/application/user/queries/list-user.query";

export interface UsersQueryService {
  find(query: ListUserQuery): Promise<PaginatedDto<UserDto>>;
  findById(id: string): Promise<UserDto | null>;
}
