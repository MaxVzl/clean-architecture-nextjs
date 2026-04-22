import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { ListUserPostsQuery } from "@/core/application/posts/queries/list-user-posts.query";
import { CreateUserCommand } from "@/core/application/users/commands/create-user.command";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";
import { Role } from "@/core/domain/users/enums/role.enum";
import {
  createPostUseCase,
  createUserUseCase,
  getUserUseCase,
  listUserPostsUseCase,
  listUsersUseCase,
} from "@/lib/factories";
import { withAuth, withRoles } from "@/middlewares/auth.middleware";

export const sdk = {
  me: {
    get: () =>
      withAuth(async ({ user }) => getUserUseCase.execute({ id: user.id })),
    posts: {
      list: (query: ListUserPostsQuery) =>
        withAuth(async ({ user }) =>
          listUserPostsUseCase.execute(query, { userId: user.id }),
        ),
      create: (command: CreatePostCommand) =>
        withAuth(async ({ user }) =>
          createPostUseCase.execute(command, { userId: user.id }),
        ),
    },
  },

  users: {
    list: (query: ListUsersQuery) => listUsersUseCase.execute(query),
    get: (query: GetUserQuery) => getUserUseCase.execute(query),
    create: (command: CreateUserCommand) =>
      withRoles([Role.ADMIN], () => createUserUseCase.execute(command)),
    posts: {
      list: (query: ListUserPostsQuery, context: { userId: string }) =>
        listUserPostsUseCase.execute(query, context),
    },
  },
};
