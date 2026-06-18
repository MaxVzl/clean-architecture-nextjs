import { OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container/container.prod";
import { createRoute } from "@hono/zod-openapi";
import { userSchema } from "@/core/application/user/dtos/user.dto";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { listUserQuerySchema } from "@/core/application/user/queries/list-user.query";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";

const { usersController, postsController } = container;

export const usersRouter = new OpenAPIHono();

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      query: listUserQuerySchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(userSchema),
          },
        },
        headers: z.object({
          "X-Total-Count": z.number(),
        }),
        description: "Retrieve the users",
      },
    },
  }),
  (c) => usersController.index(c),
);

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/:userId",
    request: {
      params: z.object({
        userId: uuidSchema,
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: userSchema,
          },
        },
        description: "Retrieve the user",
      },
      404: {
        description: "User not found",
      },
    },
  }),
  (c) => usersController.show(c),
);

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/:userId/posts",
    request: {
      params: z.object({
        userId: uuidSchema,
      }),
      query: listPostQuerySchema.omit({ userId: true }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(postSchema),
          },
        },
        headers: z.object({
          "X-Total-Count": z.number(),
        }),
        description: "Retrieve the user's posts",
      },
    },
  }),
  (c) => postsController.index(c),
);
