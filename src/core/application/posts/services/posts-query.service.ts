import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListUserPostsQuery } from "@/core/application/posts/queries/list-user-posts.query";

export interface PostsQueryService {
  findByUserId(query: ListUserPostsQuery): Promise<PostDto[]>;
}
