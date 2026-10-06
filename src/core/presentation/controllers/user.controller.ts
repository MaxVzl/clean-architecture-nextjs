import { RouteHandler } from "@hono/zod-openapi";

import { UsersReadModel } from "@/core/application/user/read-models/users.read-model";
import { Controller } from "@/core/presentation/common/controller.base";
import {
  getUserRoute,
  listUserRoute,
} from "@/core/presentation/routes/user.routes";

interface UserControllerDeps {
  usersReadModel: UsersReadModel;
}

export class UserController extends Controller<UserControllerDeps> {
  index: RouteHandler<typeof listUserRoute> = async (c) => {
    const { data, total } = await this.deps.usersReadModel.find(
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  };

  show: RouteHandler<typeof getUserRoute> = async (c) => {
    const user = await this.deps.usersReadModel.findById(
      c.req.valid("param").userId,
    );
    return user ? c.json(user, 200) : c.notFound();
  };
}
