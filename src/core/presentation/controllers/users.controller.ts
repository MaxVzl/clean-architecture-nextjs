import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Context } from "hono";
import { Controller } from "@/core/presentation/common/controller.base";
import { ListUserQuery } from "@/core/application/user/queries/list-user.query";

interface UsersControllerDeps {
  usersQueryService: UsersQueryService;
}

export class UsersController extends Controller<UsersControllerDeps> {
  async index({ c, query }: { c: Context; query: ListUserQuery }) {
    console.log(c.req.query(), query);
    const { data, total } = await this.deps.usersQueryService.find({
      nameContains: query.nameContains,
      emailContains: query.emailContains,
      limit: query.limit,
      offset: query.offset,
    });
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  }

  async show({ c, params }: { c: Context; params: { userId: string } }) {
    const user = await this.deps.usersQueryService.findById(params.userId);
    return user ? c.json(user, 200) : c.notFound();
  }
}
