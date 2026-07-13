import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";
import { validController } from "@/core/presentation/helpers/valid-controller.helper";

const { postsController } = container;

export const postsRouter = new OpenAPIHono();

postsRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      query: listPostQuerySchema,
    },
    responses: paginatedResponse(postSchema, "Retrieve the posts"),
  }),
  (c) => postsController.index(validController(c)),
);

postsRouter.openapi(
  createRoute({
    method: "get",
    path: "/:postId",
    request: {
      params: z.object({
        postId: uuidSchema,
      }),
    },
    responses: singleItemResponse(postSchema, "Retrieve the post"),
  }),
  (c) => postsController.show(validController(c)),
);
