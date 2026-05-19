import { eq } from "drizzle-orm";

import { PostDto } from "@/core/application/post/dtos/post.dto";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";

export class DrizzlePostsQueryService implements PostsQueryService {
  async find(query: ListPostQuery): Promise<PostDto[]> {
    const rows =
      query.userId !== undefined
        ? await db
            .select()
            .from(postsTable)
            .where(eq(postsTable.userId, query.userId))
        : await db.select().from(postsTable);
    return rows.map(DrizzlePostMapper.toDto);
  }
}
