import { UseCase } from "@/core/application/common/use-case.base";
import { UserPostContext } from "@/core/application/posts/contexts/user-post.context";
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
  UserPostContext
> {
  async execute(
    query: ListPostsQuery,
    context: UserPostContext,
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
