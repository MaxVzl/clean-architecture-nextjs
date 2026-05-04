import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";

export interface PostsQueryService {
  find(query: ListPostsQuery): Promise<PostDto[]>;
}
