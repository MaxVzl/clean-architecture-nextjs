import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/create-user.dto";

export class GetUsersUseCase extends UseCase<
  { usersRepository: UsersRepository },
  UserDto[],
  void
> {
  async execute(): Promise<UserDto[]> {
    const users = await this.deps.usersRepository.getUsers();
    return users.map((user) => user.toDto());
  }
}
