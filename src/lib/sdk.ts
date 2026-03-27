import { CreateUserUseCaseParams } from "@/core/application/users/use-cases/create-users.use-case";
import { GetUserUseCaseParams } from "@/core/application/users/use-cases/get-user.use-case";
import { Role } from "@/core/domain/users/enums/role.enum";
import {
  getUsersUseCase,
  getUserUseCase,
  createUserUseCase,
  getUserPostsUseCase,
} from "@/lib/factories";
import { withAuth, withRoles } from "@/lib/utils";

export const sdk = {
  me: () => withAuth(async (user) => user),
  users: {
    list: () => getUsersUseCase.execute(),
    show: (params: GetUserUseCaseParams) => getUserUseCase.execute(params),
    create: (params: CreateUserUseCaseParams) =>
      withRoles([Role.ADMIN], (user) => createUserUseCase.execute(params)),
    posts: {
      list: (userId: string) => getUserPostsUseCase.execute({ userId }),
    },
  },
};
