import { OpenAPIHono } from "@hono/zod-openapi";

import {
  listUserRoute,
  getUserRoute,
  listUserPostsRoute,
  createUserPostRoute,
} from "@/core/presentation/routes/user.routes";
import { postController, userController } from "@/lib/container";

export const userRouter = new OpenAPIHono()
  .openapi(listUserRoute, userController.index)
  .openapi(getUserRoute, userController.show)
  .openapi(listUserPostsRoute, postController.indexByUser)
  .openapi(createUserPostRoute, postController.create);
