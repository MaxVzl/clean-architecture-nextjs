import { OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { createRoute } from "@hono/zod-openapi";
import { userSchema } from "@/core/application/user/dtos/user.dto";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { listUserQuerySchema } from "@/core/application/user/queries/list-user.query";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { createPostSchema } from "@/core/application/post/commands/create-post.command";

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
  (c) =>
    usersController.index({
      c,
      query: c.req.valid("query"),
    }),
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
  (c) =>
    usersController.show({
      c,
      params: c.req.valid("param"),
    }),
);

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/:userId/posts",
    request: {
      params: z.object({
        userId: uuidSchema,
      }),
      query: listPostQuerySchema,
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
  (c) =>
    postsController.indexByUser({
      c,
      params: c.req.valid("param"),
      query: c.req.valid("query"),
    }),
);

usersRouter.openapi(
  createRoute({
    method: "post",
    path: "/:userId/posts",
    request: {
      params: z.object({
        userId: uuidSchema,
      }),
      body: {
        content: {
          "application/json": {
            schema: createPostSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: z.string(),
          },
        },
        description: "Create a new post",
      },
      401: {
        description: "Unauthorized",
      },
    },
  }),
  (c) =>
    postsController.create({
      c,
      params: c.req.valid("param"),
      body: c.req.valid("json"),
    }),
);
