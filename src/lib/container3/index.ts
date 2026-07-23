import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";
import { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { CreateUserUseCase } from "@/core/application/user/use-cases/create-user.use-case";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { EmailAuthNotifierService } from "@/core/infrastructure/auth/services/email-auth-notifier.service";
import { InMemoryEmailService } from "@/core/infrastructure/common/services/email/in-memory-email.service";
import { db } from "@/core/infrastructure/database";
import { DrizzlePostsRepository } from "@/core/infrastructure/post/repositories/drizzle-posts.repository";
import { DrizzlePostsQueryService } from "@/core/infrastructure/post/services/drizzle-posts-query.service";
import { EmailPostNotifierService } from "@/core/infrastructure/post/services/email-post-notifier.service";
import { DrizzleUsersRepository } from "@/core/infrastructure/user/repositories/drizzle-users.repository";
import { DrizzleUsersQueryService } from "@/core/infrastructure/user/services/drizzle-users-query.service";
import { PostController } from "@/core/presentation/controllers/post.controller";
import { UserController } from "@/core/presentation/controllers/user.controller";

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type AnyModuleFactory = (deps: never) => object;

type InferModuleDeps<TModules extends readonly AnyModuleFactory[]> =
  UnionToIntersection<Parameters<TModules[number]>[0]>;

type InferModuleResults<TModules extends readonly AnyModuleFactory[]> =
  UnionToIntersection<ReturnType<TModules[number]>>;

export const createContainer = <
  const TModules extends readonly AnyModuleFactory[],
>(
  modules: TModules,
  deps: InferModuleDeps<TModules>,
): InferModuleResults<TModules> => {
  const container = {} as InferModuleResults<TModules>;

  for (const createModule of modules) {
    Object.assign(container as object, createModule(deps as never));
  }

  return container;
};

// export const createUserModule = (deps: {
//   usersRepository: UsersRepository;
//   usersQueryService: UsersQueryService;
// }) => ({
//   usersQueryService: deps.usersQueryService,
//   userController: new UserController({
//     usersQueryService: deps.usersQueryService,
//   }),
//   createUserUseCase: new CreateUserUseCase({
//     usersRepository: deps.usersRepository,
//   }),
// });

// export const createPostModule = (deps: {
//   postsRepository: PostsRepository;
//   postsQueryService: PostsQueryService;
//   usersRepository: UsersRepository;
//   postNotifierService: PostNotifierService;
// }) => ({
//   postsQueryService: deps.postsQueryService,
//   postController: new PostController({
//     postsQueryService: deps.postsQueryService,
//     createPostUseCase: new CreatePostUseCase({
//       postsRepository: deps.postsRepository,
//       usersRepository: deps.usersRepository,
//       postNotifierService: deps.postNotifierService,
//     }),
//   }),
//   createPostUseCase: new CreatePostUseCase({
//     postsRepository: deps.postsRepository,
//     usersRepository: deps.usersRepository,
//     postNotifierService: deps.postNotifierService,
//   }),
// });

// export type ContainerDeps = Parameters<typeof createUserModule>[0] &
//   Parameters<typeof createPostModule>[0];

export const createUserModule = (deps: {
  usersRepository: UsersRepository;
  usersQueryService: UsersQueryService;
}) => ({
  usersQueryService: deps.usersQueryService,
  userController: new UserController({
    usersQueryService: deps.usersQueryService,
  }),
  createUserUseCase: new CreateUserUseCase({
    usersRepository: deps.usersRepository,
  }),
});

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

const createAuthModule = (deps: {
  authNotifierService: AuthNotifierService;
}) => ({
  authNotifierService: deps.authNotifierService,
});

export const modules = [createUserModule, createPostModule, createAuthModule];
const emailService = new InMemoryEmailService();
export const container = createContainer(modules, {
  usersRepository: new DrizzleUsersRepository({ db }),
  postsRepository: new DrizzlePostsRepository({ db }),
  usersQueryService: new DrizzleUsersQueryService({ db }),
  postsQueryService: new DrizzlePostsQueryService({ db }),
  postNotifierService: new EmailPostNotifierService({ emailService }),
  authNotifierService: new EmailAuthNotifierService({ emailService }),
});
