import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UseCase } from "@/core/application/common/use-case.base";
import { UserDto } from "../dtos/user.dto";

export interface GetUsersUseCaseDeps {
  usersRepository: UsersRepository;
}

export class GetUsersUseCase extends UseCase<
  GetUsersUseCaseDeps,
  UserDto[],
  void
> {
  async execute(): Promise<UserDto[]> {
    const users = await this.deps.usersRepository.findAll();
    return users.map((user) => user.toDto());
  }
}
