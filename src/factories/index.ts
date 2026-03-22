import { CreateUserUseCase } from "@/core/application/users/use-cases/create-users.use-case";
import { GetUserUseCase } from "@/core/application/users/use-cases/get-user.use-case";
import { GetUsersUseCase } from "@/core/application/users/use-cases/get-users.use-case";
import { GetUserPostsUseCase } from "@/core/application/posts/use-cases/get-user-posts.use-case";
import { InMemoryPostsRepository } from "@/core/infrastructure/posts/repositories/in-memory-posts.repository";
import { InMemoryUsersRepository } from "@/core/infrastructure/users/repositories/in-memory-users.repository";

// 1. Instanciation des dépendances (Singletons)
export const usersRepository = new InMemoryUsersRepository();
export const postsRepository = new InMemoryPostsRepository();

// 2. Instanciation des Use Cases (Une seule fois au démarrage)
export const getUsersUseCase = new GetUsersUseCase({ usersRepository });
export const getUserUseCase = new GetUserUseCase({ usersRepository });
export const createUserUseCase = new CreateUserUseCase({ usersRepository });
export const getUserPostsUseCase = new GetUserPostsUseCase({ postsRepository });
