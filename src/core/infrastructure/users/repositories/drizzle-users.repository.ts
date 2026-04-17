import { eq } from "drizzle-orm";

import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "@/core/domain/users/entities/user.entity";
import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { db } from "@/core/infrastructure/database";
import { user } from "@/core/infrastructure/database/schemas/auth.schema";
import { DrizzleUserMapper } from "@/core/infrastructure/users/mappers/drizzle-user.mapper";

export class DrizzleUsersRepository implements UsersRepository {
  async findById(id: UUID): Promise<User | null> {
    const rows = await db
      .select()
      .from(user)
      .where(eq(user.id, id.value))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return DrizzleUserMapper.toDomain(row);
  }

  async save(userEntity: User): Promise<void> {
    await db
      .insert(user)
      .values({
        id: userEntity.id.value,
        name: userEntity.name,
        email: userEntity.email.value,
        role: userEntity.role,
      })
      .onConflictDoUpdate({
        target: user.id,
        set: {
          name: userEntity.name,
          email: userEntity.email.value,
          role: userEntity.role,
        },
      });
  }
}
