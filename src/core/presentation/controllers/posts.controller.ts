import { PostsQueryService } from "@/core/application/post/services/posts-query.service";
import { Context } from "hono";
import { Controller } from "@/core/presentation/common/controller.base";
import { CreatePostUseCase } from "@/core/application/post/use-cases/create-post.use-case";
import { ListPostQuery } from "@/core/application/post/queries/list-post.query";
import { CreatePostCommand } from "@/core/application/post/commands/create-post.command";

interface PostsControllerDeps {
  postsQueryService: PostsQueryService;
  createPostUseCase: CreatePostUseCase;
}

export class PostsController extends Controller<PostsControllerDeps> {
  async index({ c, query }: { c: Context; query: ListPostQuery }) {
    const { data, total } = await this.deps.postsQueryService.find({
      titleContains: query.titleContains,
      limit: query.limit,
      offset: query.offset,
    });
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  }

  async show({ c, params }: { c: Context; params: { postId: string } }) {
    const post = await this.deps.postsQueryService.findById(params.postId);
    return post ? c.json(post, 200) : c.notFound();
  }

  async create({
    c,
    params,
    body,
  }: {
    c: Context;
    params: { userId: string };
    body: CreatePostCommand;
  }) {
    const postId = await this.deps.createPostUseCase.execute(body, {
      userId: params.userId,
    });
    return c.json(postId, 201);
  }

  async indexByUser({
    c,
    params,
    query,
  }: {
    c: Context;
    params: { userId: string };
    query: ListPostQuery;
  }) {
    const { data, total } = await this.deps.postsQueryService.findByUserId(
      params.userId,
      {
        titleContains: query.titleContains,
        limit: query.limit,
        offset: query.offset,
      },
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  }
}
