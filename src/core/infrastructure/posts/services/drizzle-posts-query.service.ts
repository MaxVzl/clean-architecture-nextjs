import { eq } from "drizzle-orm";

import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";
import { DrizzlePostMapper } from "@/core/infrastructure/posts/mappers/drizzle-post.mapper";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";

export class DrizzlePostsQueryService implements PostsQueryService {
  async find(query: ListPostsQuery): Promise<PostDto[]> {
    if (query.userId === undefined) {
      return [];
    }
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.userId, query.userId));
    return rows.map(DrizzlePostMapper.toDto);
  }
}
