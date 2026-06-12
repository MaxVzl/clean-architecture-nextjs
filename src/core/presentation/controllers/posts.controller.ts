import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { Context } from "hono";

export class PostsController {
  constructor(
    private readonly deps: { postsQueryService: PostsQueryService },
  ) {}

  async index(c: Context, query?: ListPostQuery) {
    const posts = await this.deps.postsQueryService.find(query ?? {});
    return c.json(posts);
  }
}
