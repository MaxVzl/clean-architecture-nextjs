import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Context } from "hono";

export class UsersController {
  constructor(
    private readonly deps: { usersQueryService: UsersQueryService },
  ) {}

  async index(c: Context) {
    const users = await this.deps.usersQueryService.find({});
    return c.json(users);
  }

  async show(c: Context) {
    const userId = c.req.param("userId") as string;
    const user = await this.deps.usersQueryService.findById(userId);
    return c.json(user);
  }
}
