import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UseCase } from "@/core/application/common/use-case.base";
import { User } from "@/core/domain/users/entities/user.entity";
import { Email } from "@/core/domain/users/value-objects/email.vo";
import { CreateUserCommand } from "@/core/application/users/commands/create-user.command";

export interface CreateUserUseCaseDeps {
  usersRepository: UsersRepository;
}

export class CreateUserUseCase extends UseCase<
  CreateUserUseCaseDeps,
  string,
  CreateUserCommand
> {
  async execute(command: CreateUserCommand): Promise<string> {
    const user = User.create({
      name: command.data.name,
      email: Email.create(command.data.email),
      role: command.data.role,
    });
    await this.deps.usersRepository.save(user);
    return user.id.value;
  }
}
