import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { Context } from "hono";
import { Controller } from "@/core/presentation/common/controller.base";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";

interface PostsControllerDeps {
  postsQueryService: PostsQueryService;
  createPostUseCase: CreatePostUseCase;
}

export class PostsController extends Controller<PostsControllerDeps> {
  async index(c: Context) {
    const { data, total } = await this.deps.postsQueryService.find({
      userId: c.req.param("userId"),
      titleContains: c.req.query("titleContains"),
      limit: c.req.query("limit") ? parseInt(c.req.query("limit")!) : undefined,
      offset: c.req.query("offset")
        ? parseInt(c.req.query("offset")!)
        : undefined,
    });
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  }

  async show(c: Context) {
    const postId = c.req.param("postId") as string;
    const post = await this.deps.postsQueryService.findById(postId);
    return post ? c.json(post, 200) : c.notFound();
  }

  async create(c: Context) {
    const userId = c.req.param("userId") as string;
    const body = await c.req.json();
    const postId = await this.deps.createPostUseCase.execute(body, {
      userId,
    });
    return c.json(postId, 201);
  }
}
