import { UserDto } from "@/core/application/users/dtos/user.dto";
import { User } from "@/core/domain/users/entities/user.entity";

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      role: user.role,
    };
  }
}
