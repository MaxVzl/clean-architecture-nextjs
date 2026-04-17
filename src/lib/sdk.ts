import { Role } from "@/core/domain/users/enums/role.enum";
import {
  getUserUseCase,
  createUserUseCase,
  listUserPostsUseCase,
  listUsersUseCase,
} from "@/lib/factories";
import { withAuth, withRoles } from "@/lib/utils";
import { ListUsersQuery } from "@/core/application/users/queries/list-users.query";
import { CreateUserCommand } from "@/core/application/users/commands/create-user.command";
import { GetUserQuery } from "@/core/application/users/queries/get-user.query";
import { ListUserPostsQuery } from "@/core/application/posts/queries/list-user-posts.query";

export const sdk = {
  me: () => withAuth(async (user) => user),
  users: {
    list: (query: ListUsersQuery) => listUsersUseCase.execute(query),
    show: (query: GetUserQuery) => getUserUseCase.execute(query),
    create: (command: CreateUserCommand) =>
      withRoles([Role.ADMIN], (user) => createUserUseCase.execute(command)),
    posts: {
      list: (query: ListUserPostsQuery) => listUserPostsUseCase.execute(query),
    },
  },
};
