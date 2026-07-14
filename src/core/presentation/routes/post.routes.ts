import { createRoute, z } from "@hono/zod-openapi";

import { postSchema } from "@/core/application/post/dtos/post.dto";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";

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
