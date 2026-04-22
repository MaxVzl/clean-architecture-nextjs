import { UserPostContext } from "@/core/application/posts/contexts/user-post.context";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListUserPostsQuery } from "@/core/application/posts/queries/list-user-posts.query";

export interface PostsQueryService {
  findByUserId(
    query: ListUserPostsQuery,
    context: UserPostContext,
  ): Promise<PostDto[]>;
}
