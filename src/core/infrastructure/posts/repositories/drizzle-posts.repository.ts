import { eq } from "drizzle-orm";

import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";
import { DrizzlePostMapper } from "@/core/infrastructure/posts/mappers/drizzle-post.mapper";

export class DrizzlePostsRepository implements PostsRepository {
  async findByUserId(userId: UUID): Promise<Post[]> {
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.userId, userId.value));
    return rows.map(DrizzlePostMapper.toDomain);
  }
}
