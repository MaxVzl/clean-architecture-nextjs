import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { Context } from "hono";

export class PostsController {
  constructor(
    private readonly deps: { postsQueryService: PostsQueryService },
  ) {}

  async index(c: Context) {
    const posts = await this.deps.postsQueryService.find({
      userId: c.req.param("userId"),
    });
    return c.json(posts);
  }

  async show(c: Context) {
    const postId = c.req.param("postId") as string;
    const post = await this.deps.postsQueryService.findById(postId);
    return post ? c.json(post) : c.notFound();
  }
}
