import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListMyPostsQuery } from "@/core/application/posts/queries/list-my-posts.query";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";

export interface ListMyPostsUseCaseDeps {
  postsQueryService: PostsQueryService;
}

export class ListMyPostsUseCase extends UseCase<
  ListMyPostsUseCaseDeps,
  PostDto[],
  ListMyPostsQuery,
  { userId: string }
> {
  async execute(
    query: ListMyPostsQuery,
    context: { userId: string },
  ): Promise<PostDto[]> {
    return this.deps.postsQueryService.findByUserId({
      ...query,
      userId: context.userId,
    });
  }
}
