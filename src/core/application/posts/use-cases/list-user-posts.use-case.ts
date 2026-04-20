import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";

export interface ListUserPostsUseCaseDeps {
  postsQueryService: PostsQueryService;
}

export class ListUserPostsUseCase extends UseCase<
  ListUserPostsUseCaseDeps,
  PostDto[],
  ListPostsQuery,
  { userId: string }
> {
  async execute(
    query: ListPostsQuery,
    context: { userId: string },
  ): Promise<PostDto[]> {
    return this.deps.postsQueryService.findByUserId(query, context.userId);
  }
}
