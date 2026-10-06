import { Post } from "@/core/domain/post/entities/post.entity";
import { PostRepository } from "@/core/domain/post/repositories/post.repository";
import { Database } from "@/core/infrastructure/database";
import { DrizzlePostMapper } from "@/core/infrastructure/post/mappers/drizzle-post.mapper";
import { postTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";

export interface DrizzlePostRepositoryDeps {
  db: Database;
}

export class DrizzlePostRepository implements PostRepository {
  constructor(private readonly deps: DrizzlePostRepositoryDeps) {}
  async save(post: Post): Promise<void> {
    const row = DrizzlePostMapper.toPersistence(post);
    await this.deps.db.insert(postTable).values(row);
  }
}
