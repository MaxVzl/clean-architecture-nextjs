import { PostsReadModel } from "@/core/application/post/read-models/posts.read-model";
import { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { PostController } from "@/core/presentation/controllers/post.controller";

export type PostModuleDeps = {
  postsRepository: PostsRepository;
  postsReadModel: PostsReadModel;
  usersRepository: UsersRepository;
  postNotifierService: PostNotifierService;
};

export const createPostModule = (deps: PostModuleDeps) => ({
  postsReadModel: deps.postsReadModel,
  postController: new PostController({
    postsReadModel: deps.postsReadModel,
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
