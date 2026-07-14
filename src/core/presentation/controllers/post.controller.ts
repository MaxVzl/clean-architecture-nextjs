import { RouteHandler } from "@hono/zod-openapi";

import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { Controller } from "@/core/presentation/common/controller.base";
import {
  getPostRoute,
  listPostRoute,
} from "@/core/presentation/routes/post.routes";
import {
  createUserPostRoute,
  listUserPostRoute,
} from "@/core/presentation/routes/user.routes";

interface PostControllerDeps {
  postsQueryService: PostsQueryService;
  createPostUseCase: CreatePostUseCase;
}

export class PostController extends Controller<PostControllerDeps> {
  index: RouteHandler<typeof listPostRoute> = async (c) => {
    const { data, total } = await this.deps.postsQueryService.find(
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  };

  show: RouteHandler<typeof getPostRoute> = async (c) => {
    const post = await this.deps.postsQueryService.findById(
      c.req.valid("param").postId,
    );
    return post ? c.json(post, 200) : c.notFound();
  };

  create: RouteHandler<typeof createUserPostRoute> = async (c) => {
    const postId = await this.deps.createPostUseCase.execute(
      c.req.valid("json"),
      {
        userId: c.req.valid("param").userId,
      },
    );
    return c.json(postId, 201);
  };

  indexByUser: RouteHandler<typeof listUserPostRoute> = async (c) => {
    const { data, total } = await this.deps.postsQueryService.findByUserId(
      c.req.valid("param").userId,
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  };
}
