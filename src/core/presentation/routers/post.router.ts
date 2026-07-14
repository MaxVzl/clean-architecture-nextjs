import { OpenAPIHono } from "@hono/zod-openapi";

import {
  listPostRoute,
  getPostRoute,
} from "@/core/presentation/routes/post.routes";
import { postController } from "@/lib/container";

export const postRouter = new OpenAPIHono()
  .openapi(listPostRoute, postController.index)
  .openapi(getPostRoute, postController.show);
