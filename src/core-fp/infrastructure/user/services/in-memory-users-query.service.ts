import { ListUserQuery } from "@/core-fp/application/user/queries/list-user.query";
import { UsersQueryService } from "@/core-fp/application/user/services/users-query.service";
import { User } from "@/core-fp/domain/user/entities/user.entity";
import { service } from "@/core-fp/infrastructure/common/service.base";

type MakeInMemoryUsersQueryServiceDeps = {
  db: Map<string, User>;
};

export const makeInMemoryUsersQueryService = service<
  MakeInMemoryUsersQueryServiceDeps,
  UsersQueryService
>((deps) => ({
  find: async (query: ListUserQuery) => {
    const users = Array.from(deps.db.values());
    return users.filter((user) => {
      return (
        user.name.includes(query.nameContains ?? "") &&
        user.email.includes(query.emailContains ?? "")
      );
    });
  },
  findById: async (id: string) => deps.db.get(id) ?? null,
}));
