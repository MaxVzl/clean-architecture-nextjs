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
    const row = DrizzleUserMapper.toPersistence(userEntity);
    await db
      .insert(user)
      .values(row)
      .onConflictDoUpdate({
        target: user.id,
        set: {
          name: row.name,
          email: row.email,
          role: row.role,
          image: row.image,
          emailVerified: row.emailVerified,
        },
      });
  }
}
