import { devContainer } from "./container.dev";
import { prodContainer } from "./container.prod";

const container =
  process.env.NODE_ENV === "production" ? prodContainer : devContainer;

export const {
  // Services
  userReadModel,
  postReadModel,
  authNotifierService,
  // Controllers
  userController,
  postController,
  // Use cases
  createUserUseCase,
  createPostUseCase,
} = container;
