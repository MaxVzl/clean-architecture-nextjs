import { UseCase } from "@/core/application/common/use-case.base";
import { CreateUserCommand } from "@/core/application/user/commands/create-user.command";
import { User } from "@/core/domain/user/entities/user.entity";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { Email } from "@/core/domain/user/value-objects/email.vo";

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
      name: command.name,
      email: Email.create(command.email),
      role: command.role,
    });
    await this.deps.usersRepository.save(user);
    return user.id.value;
  }
}
