import { asc, count, eq, like, or, SQL } from "drizzle-orm";

import { PaginatedDto } from "@/core/application/common/dtos/paginated.dto";
import { UserDto } from "@/core/application/user/dtos/user.dto";
import { ListUserQuery } from "@/core/application/user/queries/list-user.query";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { user } from "@/core/infrastructure/auth/schemas/drizzle-auth.schema";
import { db } from "@/core/infrastructure/database";
import { DrizzleUserMapper } from "@/core/infrastructure/user/mappers/drizzle-user.mapper";

function containsWhere(filter: {
  nameContains?: string | undefined;
  emailContains?: string | undefined;
}): SQL | undefined {
  const nameTerm = filter.nameContains?.trim().toLowerCase();
  const emailTerm = filter.emailContains?.trim().toLowerCase();
  const parts: SQL[] = [];
  if (nameTerm) {
    parts.push(like(user.name, `%${nameTerm}%`));
  }
  if (emailTerm) {
    parts.push(like(user.email, `%${emailTerm}%`));
  }
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return or(...parts)!;
}

export class DrizzleUsersQueryService implements UsersQueryService {
  async find(query: ListUserQuery): Promise<PaginatedDto<UserDto>> {
    const limit = Math.max(1, query.limit ?? 10);
    const page = Math.max(1, query.offset ?? 1);
    const start = (page - 1) * limit;

    const whereClause = containsWhere({
      nameContains: query.nameContains,
      emailContains: query.emailContains,
    });

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

    return {
      data: rows.map(DrizzleUserMapper.toDto),
      total: countRow?.total ?? 0,
      offset: page,
      limit,
    };
  }

  async findById(id: string): Promise<UserDto | null> {
    const rows = await db.select().from(user).where(eq(user.id, id)).limit(1);
    const row = rows[0];
    return row ? DrizzleUserMapper.toDto(row) : null;
  }
}
