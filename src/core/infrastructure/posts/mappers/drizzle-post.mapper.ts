import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { postsTable } from "@/core/infrastructure/database/schemas/posts.schema";

export class DrizzlePostMapper {
  static toDto(row: typeof postsTable.$inferSelect): PostDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
    };
  }

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

  static toPersistence(post: Post): typeof postsTable.$inferInsert {
    return {
      id: post.id.value,
      userId: post.userId.value,
      title: post.title,
      description: post.description,
    };
  }
}
