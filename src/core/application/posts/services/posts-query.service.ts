import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { PostQueryFilter } from "@/core/application/posts/filters/post-query.filter";

export interface PostsQueryService {
  find(filter: PostQueryFilter): Promise<PostDto[]>;
}
