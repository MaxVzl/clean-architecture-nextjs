import { PostReadModel } from "@/core/application/post/read-models/post.read-model";
import { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { PostRepository } from "@/core/domain/post/repositories/post.repository";
import { UserRepository } from "@/core/domain/user/repositories/user.repository";
import { PostController } from "@/core/presentation/controllers/post.controller";

export type PostModuleDeps = {
  postRepository: PostRepository;
  postReadModel: PostReadModel;
  userRepository: UserRepository;
  postNotifierService: PostNotifierService;
};

export const createPostModule = (deps: PostModuleDeps) => ({
  postReadModel: deps.postReadModel,
  postController: new PostController({
    postReadModel: deps.postReadModel,
    createPostUseCase: new CreatePostUseCase({
      postRepository: deps.postRepository,
      userRepository: deps.userRepository,
      postNotifierService: deps.postNotifierService,
    }),
  }),
  createPostUseCase: new CreatePostUseCase({
    postRepository: deps.postRepository,
    userRepository: deps.userRepository,
    postNotifierService: deps.postNotifierService,
  }),
});
