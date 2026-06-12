import { ListUserQuery } from "@/core/application/user/queries/list-user.query";
import { UsersQueryService } from "@/core/application/user/services/users-query.service";
import { Context } from "hono";

export class UsersController {
  constructor(
    private readonly deps: { usersQueryService: UsersQueryService },
  ) {}

  async index(c: Context, query?: ListUserQuery) {
    const users = await this.deps.usersQueryService.find(query ?? {});
    return c.json(users);
  }

  async show(c: Context, userId: string) {
    const user = await this.deps.usersQueryService.findById(userId);
    return c.json(user);
  }
}
