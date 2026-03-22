import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { UserMapper } from "@/core/application/users/mappers/user.mapper";
import { UserNotFoundError } from "@/core/domain/users/errors/user-not-found.error";

export interface GetUserUseCaseDeps {
  usersRepository: UsersRepository;
}

export interface GetUserUseCaseParams {
  id: string;
}

export class GetUserUseCase extends UseCase<
  GetUserUseCaseDeps,
  UserDto,
  GetUserUseCaseParams
> {
  async execute({ id }: GetUserUseCaseParams): Promise<UserDto> {
    const user = await this.deps.usersRepository.findById(UUID.create(id));
    if (!user) {
      throw new UserNotFoundError({ identifier: id });
    }
    return UserMapper.toDto(user);
  }
}
