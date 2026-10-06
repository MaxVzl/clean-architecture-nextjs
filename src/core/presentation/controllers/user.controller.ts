import { RouteHandler } from "@hono/zod-openapi";

import { UserReadModel } from "@/core/application/user/read-models/user.read-model";
import {
  getUserRoute,
  listUserRoute,
} from "@/core/presentation/routes/user.routes";

interface UserControllerDeps {
  userReadModel: UserReadModel;
}

export class UserController {
  constructor(private readonly deps: UserControllerDeps) {}

  index: RouteHandler<typeof listUserRoute> = async (c) => {
    const { data, total } = await this.deps.userReadModel.find(
      c.req.valid("query"),
    );
    return c.json(data, 200, {
      "X-Total-Count": total.toString(),
    });
  };

  show: RouteHandler<typeof getUserRoute> = async (c) => {
    const user = await this.deps.userReadModel.findById(
      c.req.valid("param").userId,
    );
    return user ? c.json(user, 200) : c.notFound();
  };
}
