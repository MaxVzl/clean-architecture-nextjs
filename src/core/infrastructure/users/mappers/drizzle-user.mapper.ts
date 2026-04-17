import { UserDto } from "@/core/application/users/dtos/user.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "@/core/domain/users/entities/user.entity";
import { Role } from "@/core/domain/users/enums/role.enum";
import { Email } from "@/core/domain/users/value-objects/email.vo";
import { user as userTable } from "@/core/infrastructure/database/schemas/auth.schema";

export class DrizzleUserMapper {
  private static toRole(role: (typeof userTable.$inferSelect)["role"]): Role {
    return role === Role.ADMIN || role === Role.MEMBER || role === Role.READER
      ? role
      : Role.MEMBER;
  }

  static toDto(row: typeof userTable.$inferSelect): UserDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: DrizzleUserMapper.toRole(row.role),
    };
  }

  static toDomain(user: typeof userTable.$inferSelect): User {
    return User.restore(
      {
        name: user.name,
        email: Email.create(user.email),
        role: DrizzleUserMapper.toRole(user.role),
      },
      UUID.create(user.id),
    );
  }

  static toPersistence(user: User): typeof userTable.$inferInsert {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      role: user.role,
    };
  }
}
