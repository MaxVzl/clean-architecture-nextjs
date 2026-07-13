import { OpenAPIHono } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { listPostRoute } from "@/core/presentation/routes/post.routes";
import { getPostRoute } from "@/core/presentation/routes/post.routes";

export const postRouter = new OpenAPIHono()
  .openapi(listPostRoute, container.postController.index)
  .openapi(getPostRoute, container.postController.show);
