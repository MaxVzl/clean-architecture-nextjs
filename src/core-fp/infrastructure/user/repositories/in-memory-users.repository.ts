import { User } from "@/core-fp/domain/user/entities/user.entity";
import { UsersRepository } from "@/core-fp/domain/user/repositories/users.repository";
import { repository } from "@/core-fp/infrastructure/common/repository.base";

type MakeInMemoryUsersRepositoryDeps = {
  db: Map<string, User>;
};

export const makeInMemoryUsersRepository = repository<
  MakeInMemoryUsersRepositoryDeps,
  UsersRepository
>((deps) => ({
  findById: async (id: string) => deps.db.get(id) ?? null,
  create: async (user: User) => {
    deps.db.set(user.id, user);
    return user;
  },
}));
