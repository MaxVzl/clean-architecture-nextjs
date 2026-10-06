import { and, asc, count, eq, like, SQL } from "drizzle-orm";

import { PaginatedDto } from "@/core/application/common/dtos/paginated.dto";
import { PostDto } from "@/core/application/post/dtos/post.dto";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { PostReadModel } from "@/core/application/post/read-models/post.read-model";
import { Database } from "@/core/infrastructure/database";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";
import { postTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";

function buildWhere(filter: {
  userId?: string | undefined;
  titleContains?: string | undefined;
}): SQL | undefined {
  const parts: SQL[] = [];
  if (filter.userId) {
    parts.push(eq(postTable.userId, filter.userId));
  }
  const titleTerm = filter.titleContains?.trim().toLowerCase();
  if (titleTerm) {
    parts.push(like(postTable.title, `%${titleTerm}%`));
  }
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return and(...parts)!;
}

export interface DrizzlePostReadModelDeps {
  db: Database;
}

export class DrizzlePostReadModel implements PostReadModel {
  constructor(private readonly deps: DrizzlePostReadModelDeps) {}
  async find(query: ListPostQuery): Promise<PaginatedDto<PostDto>> {
    const limit = Math.max(1, query.limit ?? 10);
    const page = Math.max(1, query.offset ?? 1);
    const start = (page - 1) * limit;

    const whereClause = buildWhere({
      titleContains: query.titleContains,
    });

    const rows = await this.deps.db
      .select()
      .from(postTable)
      .where(whereClause)
      .orderBy(asc(postTable.id))
      .limit(limit)
      .offset(start);

    const [countRow] = await this.deps.db
      .select({ total: count() })
      .from(postTable)
      .where(whereClause);

    return {
      data: rows.map(DrizzlePostMapper.toDto),
      total: countRow?.total ?? 0,
      offset: page,
      limit,
    };
  }

  async findByUserId(
    userId: string,
    query: ListPostQuery,
  ): Promise<PaginatedDto<PostDto>> {
    const limit = Math.max(1, query.limit ?? 10);
    const page = Math.max(1, query.offset ?? 1);
    const start = (page - 1) * limit;

    const whereClause = buildWhere({
      userId,
      titleContains: query.titleContains,
    });

    const rows = await this.deps.db
      .select()
      .from(postTable)
      .where(whereClause)
      .orderBy(asc(postTable.id))
      .limit(limit)
      .offset(start);

    const [countRow] = await this.deps.db
      .select({ total: count() })
      .from(postTable)
      .where(whereClause);

    return {
      data: rows.map(DrizzlePostMapper.toDto),
      total: countRow?.total ?? 0,
      offset: page,
      limit,
    };
  }

  async findById(id: string): Promise<PostDto | null> {
    const rows = await this.deps.db
      .select()
      .from(postTable)
      .where(eq(postTable.id, id))
      .limit(1);
    const row = rows[0];
    return row ? DrizzlePostMapper.toDto(row) : null;
  }
}
