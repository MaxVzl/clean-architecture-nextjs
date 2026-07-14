import { Post } from "@/core/domain/post/entities/post.entity";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";
import { postsTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";

export class DrizzlePostsRepository implements PostsRepository {
  async save(post: Post): Promise<void> {
    const row = DrizzlePostMapper.toPersistence(post);
    await db.insert(postsTable).values(row);
  }
}
