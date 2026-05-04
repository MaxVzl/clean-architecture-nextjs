import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/posts/dtos/post.dto";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";
import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";

export interface ListPostsUseCaseDeps {
  postsQueryService: PostsQueryService;
}

export class ListPostsUseCase extends UseCase<
  ListPostsUseCaseDeps,
  PostDto[],
  ListPostsQuery
> {
  async execute(query: ListPostsQuery): Promise<PostDto[]> {
    return this.deps.postsQueryService.find(query);
  }
}
