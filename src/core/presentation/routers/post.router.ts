import { OpenAPIHono } from "@hono/zod-openapi";
import { postController } from "@/lib/container";
import { listPostRoute } from "@/core/presentation/routes/post.routes";
import { getPostRoute } from "@/core/presentation/routes/post.routes";

export const postRouter = new OpenAPIHono()
  .openapi(listPostRoute, postController.index)
  .openapi(getPostRoute, postController.show);
