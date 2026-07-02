import { CreateUserCommand } from "@/core-fp/application/user/commands/create-user.command";
import { UsersRepository } from "../../../domain/user/repositories/users.repository";
import { User } from "../../../domain/user/entities/user.entity";
import { useCase } from "../../common/use-case.base";

type MakeCreateUserUseCaseDeps = {
  usersRepository: UsersRepository;
};

export const makeCreateUserUseCase = useCase<
  MakeCreateUserUseCaseDeps,
  CreateUserCommand,
  User
>(async (deps, command) => {
  return deps.usersRepository.create({
    id: crypto.randomUUID(),
    name: command.name,
    email: command.email,
  });
});
