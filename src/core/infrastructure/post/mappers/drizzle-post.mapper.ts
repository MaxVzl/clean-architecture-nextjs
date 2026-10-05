import { PostDto } from "@/core/application/post/dtos/post.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/post/entities/post.entity";
import { postsTable } from "@/core/infrastructure/post/schemas/drizzle-post.schema";

export class DrizzlePostMapper {
  static toDto(row: typeof postsTable.$inferSelect): PostDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
    };
  }

  static toDomain(row: typeof postsTable.$inferSelect): Post {
    return Post.make(
      {
        userId: UUID.make(row.userId),
        title: row.title,
        description: row.description,
      },
      UUID.make(row.id),
    );
  }

  static toPersistence(post: Post): typeof postsTable.$inferInsert {
    return {
      id: post.id.value,
      userId: post.props.userId.value,
      title: post.props.title,
      description: post.props.description,
    };
  }
}
