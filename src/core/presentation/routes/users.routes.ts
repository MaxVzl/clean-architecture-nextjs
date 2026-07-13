import { OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { createRoute } from "@hono/zod-openapi";
import { userSchema } from "@/core/application/user/dtos/user.dto";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { listUserQuerySchema } from "@/core/application/user/queries/list-user.query";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { createPostSchema } from "@/core/application/post/commands/create-post.command";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";
import { jsonBody } from "@/core/presentation/helpers/json-body.helper";
import { createdResponse } from "@/core/presentation/helpers/created-response.helper";

export const usersRouter = new OpenAPIHono();

usersRouter.openapi(
  createRoute({
    method: "get",
    path: "/",
    request: {
      query: listUserQuerySchema,
    },
    responses: paginatedResponse(userSchema, "Retrieve the users"),
  }),
  async (c) => {
    const { data, total } = await container.usersQueryService.find(
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  },
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
    responses: singleItemResponse(userSchema, "Retrieve the user"),
  }),
  async (c) => {
    const user = await container.usersQueryService.findById(
      c.req.valid("param").userId,
    );
    return user ? c.json(user, 200) : c.notFound();
  },
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
    responses: paginatedResponse(postSchema, "Retrieve the user's posts"),
  }),
  async (c) => {
    const { data, total } = await container.postsQueryService.findByUserId(
      c.req.valid("param").userId,
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  },
);

usersRouter.openapi(
  createRoute({
    method: "post",
    path: "/:userId/posts",
    request: {
      params: z.object({
        userId: uuidSchema,
      }),
      body: jsonBody(createPostSchema),
    },
    responses: createdResponse(z.string(), "Post created"),
  }),
  async (c) => {
    const postId = await container.createPostUseCase.execute(
      c.req.valid("json"),
      {
        userId: c.req.valid("param").userId,
      },
    );
    return c.json(postId, 201);
  },
);
