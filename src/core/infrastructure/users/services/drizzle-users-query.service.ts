import { asc, count, eq, like, or, SQL } from "drizzle-orm";

import { Paginated } from "@/core/application/common/paginated.base";
import { UserDto } from "@/core/application/users/dtos/user.dto";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";
import { UsersQueryService } from "@/core/application/users/services/users-query.service";
import { db } from "@/core/infrastructure/database";
import { user } from "@/core/infrastructure/database/schemas/auth.schema";
import { DrizzleUserMapper } from "@/core/infrastructure/users/mappers/drizzle-user.mapper";

function searchWhere(term: string): SQL {
  const pattern = `%${term}%`;
  return or(like(user.name, pattern), like(user.email, pattern))!;
}

export class DrizzleUsersQueryService implements UsersQueryService {
  async search(query: ListUsersQuery): Promise<Paginated<UserDto>> {
    const limit = Math.max(1, query.limit ?? 10);
    const page = Math.max(1, query.offset ?? 1);
    const start = (page - 1) * limit;

    const term = query.params?.search?.trim().toLowerCase();
    const whereClause = term && term.length > 0 ? searchWhere(term) : undefined;

    const rows = await db
      .select()
      .from(user)
      .where(whereClause)
      .orderBy(asc(user.id))
      .limit(limit)
      .offset(start);

    const [countRow] = await db
      .select({ total: count() })
      .from(user)
      .where(whereClause);

    return new Paginated({
      data: rows.map(DrizzleUserMapper.toDto),
      total: countRow?.total ?? 0,
      offset: page,
      limit,
    });
  }

  async findById(query: GetUserQuery): Promise<UserDto | null> {
    const rows = await db
      .select()
      .from(user)
      .where(eq(user.id, query.id))
      .limit(1);
    const row = rows[0];
    return row ? DrizzleUserMapper.toDto(row) : null;
  }
}
