import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { Context } from "hono";
import { Controller } from "@/core/presentation/common/controller.base";
import { getPagination } from "@/core/presentation/helpers/pagination.helper";

interface PostsControllerDeps {
  postsQueryService: PostsQueryService;
};

export class PostsController extends Controller<PostsControllerDeps> {
  async index(c: Context) {
    const posts = await this.deps.postsQueryService.find({
      userId: c.req.param("userId"),
      titleContains: c.req.query("titleContains"),
      pagination: getPagination(c)
    });
    return c.json(posts, 200);
  }

  async show(c: Context) {
    const postId = c.req.param("postId") as string;
    const post = await this.deps.postsQueryService.findById(postId);
    return post ? c.json(post, 200) : c.notFound();
  }
}
