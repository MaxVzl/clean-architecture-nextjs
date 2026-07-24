import { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { PostController } from "@/core/presentation/controllers/post.controller";

export const createPostModule = (deps: {
  postsRepository: PostsRepository;
  postsQueryService: PostsQueryService;
  usersRepository: UsersRepository;
  postNotifierService: PostNotifierService;
}) => ({
  postsQueryService: deps.postsQueryService,
  postController: new PostController({
    postsQueryService: deps.postsQueryService,
    createPostUseCase: new CreatePostUseCase({
      postsRepository: deps.postsRepository,
      usersRepository: deps.usersRepository,
      postNotifierService: deps.postNotifierService,
    }),
  }),
  createPostUseCase: new CreatePostUseCase({
    postsRepository: deps.postsRepository,
    usersRepository: deps.usersRepository,
    postNotifierService: deps.postNotifierService,
  }),
});
