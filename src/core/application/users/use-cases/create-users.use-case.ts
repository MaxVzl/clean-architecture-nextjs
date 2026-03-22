import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { UseCase } from "@/core/application/common/use-case.base";
import { User } from "@/core/domain/users/entities/user.entity";
import { Email } from "@/core/domain/users/value-objects/email.vo";
import { UserMapper } from "@/core/application/users/mappers/user.mapper";

export interface CreateUserUseCaseDeps {
  usersRepository: UsersRepository;
}

export interface CreateUserUseCaseParams {
  data: CreateUserDto;
}

export class CreateUserUseCase extends UseCase<
  CreateUserUseCaseDeps,
  UserDto,
  CreateUserUseCaseParams
> {
  async execute({ data }: CreateUserUseCaseParams): Promise<UserDto> {
    const user = User.create({
      name: data.name,
      email: Email.create(data.email),
      role: data.role,
    });
    await this.deps.usersRepository.save(user);
    return UserMapper.toDto(user);
  }
}
