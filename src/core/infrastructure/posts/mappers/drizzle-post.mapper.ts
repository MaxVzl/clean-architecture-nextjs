import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";

export class DrizzlePostMapper {
  static toDomain(row: typeof postsTable.$inferSelect): Post {
    return Post.restore(
      {
        userId: UUID.create(row.userId),
        title: row.title,
        description: row.description,
      },
      UUID.create(row.id),
    );
  }
}
