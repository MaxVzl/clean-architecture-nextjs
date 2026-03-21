import {
  CreateUserUseCase,
  CreateUserUseCaseParams,
} from "@/core/application/users/use-cases/create-users.use-case";
import {
  GetUserUseCase,
  GetUserUseCaseParams,
} from "@/core/application/users/use-cases/get-user.use-case";
import { GetUsersUseCase } from "@/core/application/users/use-cases/get-users.use-case";
import { GetUserPostsUseCase } from "@/core/application/posts/use-cases/get-user-posts.use-case";
import { Role } from "@/core/domain/users/enums/role.enum";
import { InMemoryPostsRepository } from "@/core/infrastructure/posts/repositories/in-memory-posts.repository";
import { InMemoryUsersRepository } from "@/core/infrastructure/users/repositories/in-memory-users.repository";
import { withAuth, withRoles } from "@/lib/utils";

// 1. Instanciation des dépendances (Singletons)
export const usersRepository = new InMemoryUsersRepository();
export const postsRepository = new InMemoryPostsRepository();

// 2. Instanciation des Use Cases (Une seule fois au démarrage)
const getUsersUseCase = new GetUsersUseCase({ usersRepository });
const getUserUseCase = new GetUserUseCase({ usersRepository });
const createUserUseCase = new CreateUserUseCase({ usersRepository });
const getUserPostsUseCase = new GetUserPostsUseCase({ postsRepository });

export const sdk = {
  me: () => withAuth(async (user) => user),
  users: {
    list: () => getUsersUseCase.execute(),
    show: (params: GetUserUseCaseParams) => getUserUseCase.execute(params),
    create: (params: CreateUserUseCaseParams) =>
      withRoles([Role.ADMIN], (user) => createUserUseCase.execute(params)),
    posts: {
      list: (userId: string) =>
        getUserPostsUseCase.execute({ userId }),
    },
  },
};
