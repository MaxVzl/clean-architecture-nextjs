import { devContainer } from "./container.dev";
import { prodContainer } from "./container.prod";

export const container =
  process.env.NODE_ENV === "production" ? prodContainer : devContainer;

export const {
  // Services
  usersQueryService,
  postsQueryService,
  authNotifierService,
  // Controllers
  userController,
  postController,
  // Use cases
  createUserUseCase,
  createPostUseCase,
} = container;
