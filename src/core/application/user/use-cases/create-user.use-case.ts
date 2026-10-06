import { CreateUserCommand } from "@/core/application/user/commands/create-user.command";
import { User } from "@/core/domain/user/entities/user.entity";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { Email } from "@/core/domain/user/value-objects/email.vo";
import { UserName } from "@/core/domain/user/value-objects/user-name.vo";

export interface CreateUserUseCaseDeps {
  usersRepository: UsersRepository;
}

export class CreateUserUseCase {
  constructor(private readonly deps: CreateUserUseCaseDeps) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const user = User.create({
      name: UserName.make(command.name),
      email: Email.make(command.email),
      role: command.role,
    });
    await this.deps.usersRepository.save(user);
    return user.id.value;
  }
}
