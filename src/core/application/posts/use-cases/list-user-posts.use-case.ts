import { UseCase } from "@/core/application/common/use-case.base";
import { SystemContext } from "@/core/application/common/contexts/system.context";
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
  SystemContext
> {
  async execute(
    query: ListPostsQuery,
    context: SystemContext,
  ): Promise<PostDto[]> {
    return this.deps.postsQueryService.find({
      userId: context.userId,
      titleContains: query.search,
      pagination: {
        limit: query.limit,
        offset: query.offset,
      },
    });
  }
}
