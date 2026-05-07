import { PostsQueryService } from "@/core/application/posts/services/posts-query.service";
import { CreatePostUseCase } from "@/core/application/posts/use-cases/create-post.use-case";
import { ListPostsUseCase } from "@/core/application/posts/use-cases/list-posts.use-case";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";

export type PostsModuleDeps = {
  postsRepository: PostsRepository;
  postsQueryService: PostsQueryService;
};

export function createPostsModule(deps: PostsModuleDeps) {
  return {
    listPostsUseCase: new ListPostsUseCase({
      postsQueryService: deps.postsQueryService,
    }),
    createPostUseCase: new CreatePostUseCase({
      postsRepository: deps.postsRepository,
    }),
  };
}
