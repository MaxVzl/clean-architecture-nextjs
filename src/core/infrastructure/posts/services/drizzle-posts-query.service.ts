import { eq } from "drizzle-orm";

import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";
import { DrizzlePostMapper } from "@/core/infrastructure/posts/mappers/drizzle-post.mapper";
import { PostQueryFilter } from "@/core/application/posts/filters/post-query.filter";

export class DrizzlePostsQueryService implements PostsQueryService {
  async find(filter: PostQueryFilter): Promise<PostDto[]> {
    if (filter.userId === undefined) {
      return [];
    }
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.userId, filter.userId));
    return rows.map(DrizzlePostMapper.toDto);
  }
}
