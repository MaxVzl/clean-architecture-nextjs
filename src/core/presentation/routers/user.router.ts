import { OpenAPIHono } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { listUserRoute } from "@/core/presentation/routes/user.routes";
import { getUserRoute } from "@/core/presentation/routes/user.routes";
import { listUserPostsRoute } from "@/core/presentation/routes/user.routes";
import { createUserPostRoute } from "@/core/presentation/routes/user.routes";

export const userRouter = new OpenAPIHono()
  .openapi(listUserRoute, container.userController.index)
  .openapi(getUserRoute, container.userController.show)
  .openapi(listUserPostsRoute, container.postController.indexByUser)
  .openapi(createUserPostRoute, container.postController.create);
