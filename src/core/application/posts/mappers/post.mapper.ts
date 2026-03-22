import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { Post } from "@/core/domain/posts/entities/post.entity";

export class PostMapper {
  static toDto(post: Post): PostDto {
    return {
      id: post.id.value,
      title: post.title,
      description: post.description,
    };
  }
}
