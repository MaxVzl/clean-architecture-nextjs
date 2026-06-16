import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container/container.prod";
import { paginatedSchema } from "@/core/application/common/dtos/paginated.dto";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";

const { postsController } = container;

export const postsRouter = new OpenAPIHono();

postsRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      query: listPostQuerySchema.omit({ userId: true }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: paginatedSchema(postSchema),
          },
        },
        description: "Retrieve the posts",
      },
    },
  }),
  (c) => postsController.index(c),
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
    responses: {
      200: {
        content: {
          "application/json": {
            schema: postSchema,
          },
        },
        description: "Retrieve the post",
      },
      404: {
        description: "Post not found",
      },
    },
  }),
  (c) => postsController.show(c),
);
