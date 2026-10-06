import { PostDto } from "@/core/application/post/dtos/post.dto";
import { Post } from "@/core/domain/post/entities/post.entity";
import { PostId } from "@/core/domain/post/value-objects/post-id.vo";
import { UserId } from "@/core/domain/user/value-objects/user-id.vo";
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
        authorId: UserId.make(row.userId),
        title: row.title,
        description: row.description,
      },
      PostId.make(row.id),
    );
  }

  static toPersistence(post: Post): typeof postsTable.$inferInsert {
    return {
      id: post.id.value,
      userId: post.props.authorId.value,
      title: post.props.title,
      description: post.props.description,
    };
  }
}
