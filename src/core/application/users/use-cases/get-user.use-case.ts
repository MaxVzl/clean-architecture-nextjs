import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/create-user.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";

export class GetUserUseCase extends UseCase<
  { usersRepository: UsersRepository },
  UserDto,
  { id: string }
> {
  async execute({ id }: { id: string }): Promise<UserDto> {
    const user = await this.deps.usersRepository.findById(UUID.create(id));
    if (!user) {
      throw new Error("User not found");
    }
    return user.toDto();
  }
}
