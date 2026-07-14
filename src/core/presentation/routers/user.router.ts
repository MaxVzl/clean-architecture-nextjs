import { OpenAPIHono } from "@hono/zod-openapi";

import {
  listUserRoute,
  getUserRoute,
  listUserPostRoute,
  createUserPostRoute,
} from "@/core/presentation/routes/user.routes";
import { postController, userController } from "@/lib/container";

export const userRouter = new OpenAPIHono()
  .openapi(listUserRoute, userController.index)
  .openapi(getUserRoute, userController.show)
  .openapi(listUserPostRoute, postController.indexByUser)
  .openapi(createUserPostRoute, postController.create);
