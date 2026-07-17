import { Post } from "@/core/domain/post/entities/post.entity";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { Database } from "@/core/infrastructure/database";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";
import { postsTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";

export interface DrizzlePostsRepositoryDeps {
  db: Database;
}

export class DrizzlePostsRepository implements PostsRepository {
  constructor(private readonly deps: DrizzlePostsRepositoryDeps) {}
  async save(post: Post): Promise<void> {
    const row = DrizzlePostMapper.toPersistence(post);
    await this.deps.db.insert(postsTable).values(row);
  }
}
