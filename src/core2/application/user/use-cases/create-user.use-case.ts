import { ResultAsync } from "neverthrow";

import { CreateUserCommand } from "@/core2/application/user/commands/create-user.command";
import { CreateUserError } from "@/core2/application/user/errors/user.errors";
import { createUser } from "@/core2/domain/user/entities/user.entity";
import { UsersRepository } from "@/core2/domain/user/repositories/users.repository";

export type CreateUserUseCaseDeps = {
  usersRepository: UsersRepository;
};

export const makeCreateUserUseCase = (deps: CreateUserUseCaseDeps) => {
  return (command: CreateUserCommand): ResultAsync<string, CreateUserError> => {
    return createUser({
      name: command.name,
      email: command.email,
      role: command.role,
    }).asyncMap(async (user) => {
      await deps.usersRepository.save(user);
      return user.id;
    });
  };
};
