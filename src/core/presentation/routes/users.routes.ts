import { OpenAPIHono } from "@hono/zod-openapi";
import { container } from "@/lib/container/container.prod";
import { createRoute } from "@hono/zod-openapi";
import { paginatedSchema } from "@/core/application/common/dtos/paginated.dto";
import { userSchema } from "@/core/application/user/dtos/user.dto";
import { postSchema } from "@/core/application/post/dtos/post.dto";

const { usersController, postsController } = container;

export const usersRouter = new OpenAPIHono();

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: paginatedSchema(userSchema),
          },
        },
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
    responses: {
      200: {
        content: {
          "application/json": {
            schema: paginatedSchema(postSchema),
          },
        },
        description: "Retrieve the user's posts",
      },
    },
  }),
  (c) => postsController.index(c),
);
