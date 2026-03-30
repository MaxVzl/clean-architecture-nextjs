import { CreateUserUseCase } from "@/core/application/users/use-cases/create-users.use-case";
import { GetUserUseCase } from "@/core/application/users/use-cases/get-user.use-case";
import { GetUserPostsUseCase } from "@/core/application/posts/use-cases/get-user-posts.use-case";
import { JsonPostsRepository } from "@/core/infrastructure/posts/repositories/json-posts.repository";
import { JsonUsersRepository } from "@/core/infrastructure/users/repositories/json-users.repository";
import { JsonUsersQueryService } from "@/core/infrastructure/users/services/json-users-query.service";
import { ListUsersUseCase } from "@/core/application/users/use-cases/list-users.use-case";

// 1. Instanciation des dépendances (Singletons)
export const usersRepository = new JsonUsersRepository();
export const postsRepository = new JsonPostsRepository();
export const usersQueryService = new JsonUsersQueryService();

// 2. Instanciation des Use Cases (Une seule fois au démarrage)
export const getUserUseCase = new GetUserUseCase({ usersQueryService });
export const createUserUseCase = new CreateUserUseCase({ usersRepository });
export const getUserPostsUseCase = new GetUserPostsUseCase({ postsRepository });

export const listUsersUseCase = new ListUsersUseCase({
  usersQueryService,
});
