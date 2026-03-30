import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/users/dtos/user.dto";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";
import { Role } from "@/core/domain/users/enums/role.enum";
import { readJsonArray } from "@/core/infrastructure/database/json-file-store";

const USERS_FILE = "users.json";

type UserJsonRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export class JsonUsersQueryService implements UsersQueryService {
  async search(query: ListUsersQuery): Promise<Paginated<UserDto>> {
    const limit = Math.max(1, query.limit ?? 10);
    const page = Math.max(1, query.offset ?? 1);
    const start = (page - 1) * limit;

    const rows = await readJsonArray<UserJsonRow>(USERS_FILE);
    const term = query.params?.search?.trim().toLowerCase();
    const filtered =
      term && term.length > 0
        ? rows.filter(
            (r) =>
              r.name.toLowerCase().includes(term) ||
              r.email.toLowerCase().includes(term),
          )
        : rows;

    const pageRows = filtered.slice(start, start + limit);

    return new Paginated({
      data: pageRows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
      })),
      total: filtered.length,
      offset: page,
      limit,
    });
  }

  async findById(query: GetUserQuery): Promise<UserDto | null> {
    const rows = await readJsonArray<UserJsonRow>(USERS_FILE);
    const user = rows.find((r) => r.id === query.id);
    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : null;
  }
}
