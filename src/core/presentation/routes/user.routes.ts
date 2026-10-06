import { createRoute, z } from "@hono/zod-openapi";

import { createPostSchema } from "@/core/application/post/commands/create-post.command";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { userSchema } from "@/core/application/user/dtos/user.dto";
import { listUserQuerySchema } from "@/core/application/user/queries/list-user.query";
import { userIdSchema } from "@/core/domain/user/value-objects/user-id.vo";
import { createdResponse } from "@/core/presentation/helpers/created-response.helper";
import { jsonBody } from "@/core/presentation/helpers/json-body.helper";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";

export const listUserRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: listUserQuerySchema,
  },
  responses: paginatedResponse(userSchema, "Retrieve the users"),
});

export const getUserRoute = createRoute({
  method: "get",
  path: "/:userId",
  request: {
    params: z.object({
      userId: userIdSchema,
    }),
  },
  responses: singleItemResponse(userSchema, "Retrieve the user"),
});

export const listUserPostRoute = createRoute({
  method: "get",
  path: "/:userId/posts",
  request: {
    params: z.object({
      userId: userIdSchema,
    }),
    query: listPostQuerySchema,
  },
  responses: paginatedResponse(postSchema, "Retrieve the user's posts"),
});

export const createUserPostRoute = createRoute({
  method: "post",
  path: "/:userId/posts",
  request: {
    params: z.object({
      userId: userIdSchema,
    }),
    body: jsonBody(createPostSchema),
  },
  responses: createdResponse(z.string(), "Post created"),
});
