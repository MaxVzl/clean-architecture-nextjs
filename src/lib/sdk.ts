import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { ListPostsQuery } from "@/core/application/posts/queries/list-posts.query";
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
  me: () =>
    withAuth(async ({ user }) => getUserUseCase.execute({ id: user.id })),

  posts: {
    list: (query: ListPostsQuery) =>
      withAuth(async ({ user }) =>
        listUserPostsUseCase.execute(query, { userId: user.id }),
      ),
    create: (command: CreatePostCommand) =>
      withAuth(async ({ user }) =>
        createPostUseCase.execute(command, { userId: user.id }),
      ),
  },

  public: {
    users: {
      list: (query: ListUsersQuery) => listUsersUseCase.execute(query),
      show: (query: GetUserQuery) => getUserUseCase.execute(query),
      create: (command: CreateUserCommand) =>
        withRoles([Role.ADMIN], () => createUserUseCase.execute(command)),
      posts: {
        list: (query: ListPostsQuery, userId: string) =>
          listUserPostsUseCase.execute(query, { userId }),
      },
    },
  },
};
