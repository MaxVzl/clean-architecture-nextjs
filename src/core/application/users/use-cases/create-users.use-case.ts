import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { CreateUserDto, UserDto } from "../dtos/create-user.dto";
import { UseCase } from "@/core/application/common/use-case.base";
import { User } from "@/core/domain/users/entities/user.entity";
import { Email } from "@/core/domain/users/value-objects/email.vo";

export class CreateUserUseCase extends UseCase<
  { usersRepository: UsersRepository },
  UserDto,
  CreateUserDto
> {
  async execute(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await User.create({
      name: createUserDto.name,
      email: Email.create(createUserDto.email),
      role: createUserDto.role,
    });
    const createdUser = await this.deps.usersRepository.createUser(user);
    return createdUser.toDto();
  }
}
