import { GetUserUseCase } from "@/core/application/users/use-cases/get-user.use-case";
import { ListUsersUseCase } from "@/core/application/users/use-cases/list-users.use-case";
import { CreateUserUseCase } from "@/core/application/users/use-cases/create-user.use-case";
import { ListPostsUseCase } from "@/core/application/posts/use-cases/list-posts.use-case";
import { CreatePostUseCase } from "@/core/application/posts/use-cases/create-post.use-case";

import type { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import type { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import type { UsersQueryService } from "@/core/application/users/services/users-query.service";
import type { PostsQueryService } from "@/core/application/posts/services/posts-query.service";

type ContainerDeps = {
  usersRepository: UsersRepository;
  postsRepository: PostsRepository;
  usersQueryService: UsersQueryService;
  postsQueryService: PostsQueryService;
};

export function createContainer(deps: ContainerDeps) {
  return {
    getUserUseCase: new GetUserUseCase({
      usersQueryService: deps.usersQueryService,
    }),
    listUsersUseCase: new ListUsersUseCase({
      usersQueryService: deps.usersQueryService,
    }),
    createUserUseCase: new CreateUserUseCase({
      usersRepository: deps.usersRepository,
    }),
    listPostsUseCase: new ListPostsUseCase({
      postsQueryService: deps.postsQueryService,
    }),
    createPostUseCase: new CreatePostUseCase({
      postsRepository: deps.postsRepository,
    }),
  };
}

export type Container = ReturnType<typeof createContainer>;
