import { UserDto } from "@/core/application/users/dtos/user.dto";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "@/core/domain/users/entities/user.entity";
import { Role } from "@/core/domain/users/enums/role.enum";
import { Email } from "@/core/domain/users/value-objects/email.vo";
import { user as usersTable } from "@/core/infrastructure/database/schemas/auth.schema";

export class DrizzleUserMapper {
  private static toRole(role: (typeof usersTable.$inferSelect)["role"]): Role {
    if (role === Role.ADMIN || role === Role.USER) {
      return role;
    }
    return Role.USER;
  }

  static toDto(row: typeof usersTable.$inferSelect): UserDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      emailVerified: row.emailVerified,
      role: DrizzleUserMapper.toRole(row.role),
    };
  }

  static toDomain(user: typeof usersTable.$inferSelect): User {
    return User.restore(
      {
        name: user.name,
        email: Email.create(user.email),
        role: DrizzleUserMapper.toRole(user.role),
        image: user.image,
        emailVerified: user.emailVerified,
      },
      UUID.create(user.id),
    );
  }

  static toPersistence(user: User): typeof usersTable.$inferInsert {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
    };
  }
}
