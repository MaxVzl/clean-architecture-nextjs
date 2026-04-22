import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListUserPostsQuery } from "@/core/application/posts/queries/list-user-posts.query";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";

export interface ListUserPostsUseCaseDeps {
  postsQueryService: PostsQueryService;
}

export class ListUserPostsUseCase extends UseCase<
  ListUserPostsUseCaseDeps,
  PostDto[],
  ListUserPostsQuery,
  { userId: string }
> {
  async execute(
    query: ListUserPostsQuery,
    context: { userId: string },
  ): Promise<PostDto[]> {
    return this.deps.postsQueryService.findByUserId(query, context);
  }
}
