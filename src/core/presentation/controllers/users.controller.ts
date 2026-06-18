import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Context } from "hono";
import { Controller } from "@/core/presentation/common/controller.base";
import { getPagination } from "@/core/presentation/helpers/pagination.helper";

interface UsersControllerDeps {
  usersQueryService: UsersQueryService;
};

export class UsersController extends Controller<UsersControllerDeps> {
  async index(c: Context) {
    const { data, total } = await this.deps.usersQueryService.find({
      nameContains: c.req.query("nameContains"),
      emailContains: c.req.query("emailContains"),
      pagination: getPagination(c)
    });
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  }

  async show(c: Context) {
    const userId = c.req.param("userId") as string;
    const user = await this.deps.usersQueryService.findById(userId);
    return user ? c.json(user, 200) : c.notFound();
  }
}
