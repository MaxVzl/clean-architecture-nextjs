import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from "@/lib/container";
import { postSchema } from "@/core/application/post/dtos/post.dto";
import { listPostQuerySchema } from "@/core/application/post/queries/list-post.query";
import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { paginatedResponse } from "@/core/presentation/helpers/paginated-response.helper";
import { singleItemResponse } from "@/core/presentation/helpers/single-item-response.helper";

export const postsRouter = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      request: {
        query: listPostQuerySchema,
      },
      responses: paginatedResponse(postSchema, "Retrieve the posts"),
    }),
    async (c) => {
      const { data, total } = await container.postsQueryService.find(
        c.req.valid("query"),
      );
      return c.json(data, 200, {
        "X-Total-Count": total.toString(),
      });
    },
  )
  .openapi(
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
    async (c) => {
      const post = await container.postsQueryService.findById(
        c.req.valid("param").postId,
      );
      return post ? c.json(post, 200) : c.notFound();
    },
  );
