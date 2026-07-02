import { makeInMemoryUsersQueryService } from "@/core-fp/infrastructure/user/services/in-memory-users-query.service";
import { User } from "../domain/user/entities/user.entity";
import { makeInMemoryUsersRepository } from "../infrastructure/user/repositories/in-memory-users.repository";
import { createContainer } from "@/core-fp/di/container";

const db = new Map<string, User>();

export const container = createContainer({
  usersRepository: makeInMemoryUsersRepository({ db }),
  usersQueryService: makeInMemoryUsersQueryService({ db }),
});
