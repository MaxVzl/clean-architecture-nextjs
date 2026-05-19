import { eq } from "drizzle-orm";

import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/post/entities/post.entity";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { db } from "@/core/infrastructure/database";
import { postsTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";

export class DrizzlePostsRepository implements PostsRepository {
  async findByUserId(userId: UUID): Promise<Post[]> {
    const rows = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.userId, userId.value));
    return rows.map(DrizzlePostMapper.toDomain);
  }

  async save(post: Post): Promise<void> {
    const row = DrizzlePostMapper.toPersistence(post);
    await db.insert(postsTable).values(row);
  }
}
