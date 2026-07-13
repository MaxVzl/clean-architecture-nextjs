import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { createRoute, z } from "@hono/zod-openapi";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";

export const listPostRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: listPostQuerySchema,
  },
  responses: paginatedResponse(postSchema, "Retrieve the posts"),
});

export const getPostRoute = createRoute({
  method: "get",
  path: "/:postId",
  request: {
    params: z.object({
      postId: uuidSchema,
    }),
  },
  responses: singleItemResponse(postSchema, "Retrieve the post"),
});
