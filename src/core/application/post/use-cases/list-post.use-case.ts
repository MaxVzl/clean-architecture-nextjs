import { UseCase } from "@/core/application/common/use-case.base";
import { PostDto } from "@/core/application/post/dtos/post.dto";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { PostsQueryService } from "@/core/application/post/services/posts-query.service";

export interface ListPostUseCaseDeps {
  postsQueryService: PostsQueryService;
}

export class ListPostUseCase extends UseCase<
  ListPostUseCaseDeps,
  PostDto[],
  ListPostQuery
> {
  async execute(query: ListPostQuery): Promise<PostDto[]> {
    return this.deps.postsQueryService.find(query);
  }
}
