import { CreateUserUseCase } from "@/core/application/users/use-cases/create-users.use-case";
import { GetUserUseCase } from "@/core/application/users/use-cases/get-user.use-case";
import { ListUserPostsUseCase } from "@/core/application/posts/use-cases/list-user-posts.use-case";
import { DrizzlePostsQueryService } from "@/core/infrastructure/posts/services/drizzle-posts-query.service";
import { DrizzleUsersRepository } from "@/core/infrastructure/users/repositories/drizzle-users.repository";
import { DrizzleUsersQueryService } from "@/core/infrastructure/users/services/drizzle-users-query.service";
import { ListUsersUseCase } from "@/core/application/users/use-cases/list-users.use-case";

// 1. Instanciation des dépendances (Singletons)
export const usersRepository = new DrizzleUsersRepository();
export const postsQueryService = new DrizzlePostsQueryService();
export const usersQueryService = new DrizzleUsersQueryService();

// 2. Instanciation des Use Cases (Une seule fois au démarrage)
export const getUserUseCase = new GetUserUseCase({ usersQueryService });
export const createUserUseCase = new CreateUserUseCase({ usersRepository });
export const listUserPostsUseCase = new ListUserPostsUseCase({
  postsQueryService,
});

export const listUsersUseCase = new ListUsersUseCase({
  usersQueryService,
});
