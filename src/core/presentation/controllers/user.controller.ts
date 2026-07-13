import {
  getUserRoute,
  listUserRoute,
} from "@/core/presentation/routes/user.routes";
import { RouteHandler } from "@hono/zod-openapi";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Controller } from "@/core/presentation/common/controller.base";

interface UserControllerDeps {
  usersQueryService: UsersQueryService;
}

export class UserController extends Controller<UserControllerDeps> {
  index: RouteHandler<typeof listUserRoute> = async (c) => {
    const { data, total } = await this.deps.usersQueryService.find(
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  };

  show: RouteHandler<typeof getUserRoute> = async (c) => {
    const user = await this.deps.usersQueryService.findById(
      c.req.valid("param").userId,
    );
    return user ? c.json(user, 200) : c.notFound();
  };
}
