import { eq } from "drizzle-orm";

import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";
import { Service } from "@/core/infrastructure/common/service.base";
import { DrizzlePostMapper } from "@/core/infrastructure/posts/mappers/drizzle-post.mapper";

export class DrizzlePostsQueryService
  extends Service
  implements PostsQueryService
{
  async find(query: ListPostsQuery): Promise<PostDto[]> {
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
