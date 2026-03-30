import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "@/core/domain/users/entities/user.entity";
import type { Role } from "@/core/domain/users/enums/role.enum";
import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { Email } from "@/core/domain/users/value-objects/email.vo";
import {
  readJsonArray,
  writeJsonArray,
} from "@/core/infrastructure/database/json-file-store";

const USERS_FILE = "users.json";

type UserJsonRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export class JsonUsersRepository implements UsersRepository {
  async findById(id: UUID): Promise<User | null> {
    const rows = await readJsonArray<UserJsonRow>(USERS_FILE);
    const row = rows.find((r) => r.id === id.value) ?? null;
    if (!row) return null;
    return User.restore(
      {
        name: row.name,
        email: Email.create(row.email),
        role: row.role,
      },
      UUID.create(row.id),
    );
  }

  async save(user: User): Promise<void> {
    const rows = await readJsonArray<UserJsonRow>(USERS_FILE);
    const next = {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      role: user.role,
    };
    const index = rows.findIndex((r) => r.id === next.id);
    if (index >= 0) {
      rows[index] = next;
    } else {
      rows.push(next);
    }
    await writeJsonArray(USERS_FILE, rows);
  }
}
