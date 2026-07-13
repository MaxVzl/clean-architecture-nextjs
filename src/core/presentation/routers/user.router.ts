import { OpenAPIHono } from "@hono/zod-openapi";
import { postController, userController } from "@/lib/container";
import { listUserRoute } from "@/core/presentation/routes/user.routes";
import { getUserRoute } from "@/core/presentation/routes/user.routes";
import { listUserPostsRoute } from "@/core/presentation/routes/user.routes";
import { createUserPostRoute } from "@/core/presentation/routes/user.routes";

export const userRouter = new OpenAPIHono()
  .openapi(listUserRoute, userController.index)
  .openapi(getUserRoute, userController.show)
  .openapi(listUserPostsRoute, postController.indexByUser)
  .openapi(createUserPostRoute, postController.create);
