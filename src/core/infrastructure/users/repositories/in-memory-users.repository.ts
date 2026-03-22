import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User, type UserProps } from "@/core/domain/users/entities/user.entity";
import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { Email } from "@/core/domain/users/value-objects/email.vo";

declare global {
  var __inMemoryUsers__: User[] | undefined;
}

const defaultUsers: User[] = [
  User.restore(
    {
      name: "John Doe",
      email: Email.create("john.doe@example.com"),
      role: "admin",
    },
    UUID.generate(),
  ),
  User.restore(
    {
      name: "Jane Doe",
      email: Email.create("jane.doe@example.com"),
      role: "member",
    },
    UUID.generate(),
  ),
  User.restore(
    {
      name: "John Smith",
      email: Email.create("john.smith@example.com"),
      role: "reader",
    },
    UUID.generate(),
  ),
  User.restore(
    {
      name: "Jane Smith",
      email: Email.create("jane.smith@example.com"),
      role: "admin",
    },
    UUID.generate(),
  ),
];

const globalForUsers = globalThis as typeof globalThis & {
  __inMemoryUsers__?: User[];
};

/**
 * `[]` est truthy en JS : l'ancien `global || defaults` ne remplissait jamais
 * le store quand `__inMemoryUsers__` était déjà un tableau vide (ex. état global persistant).
 */
function ensureUsersStore(): void {
  if (!globalForUsers.__inMemoryUsers__?.length) {
    globalForUsers.__inMemoryUsers__ = [...defaultUsers];
  }
}

/**
 * Après un hot-reload, les instances gardées dans `global` peuvent ne plus
 * correspondre aux classes `User` / `Email` courantes (getters ou instanceof
 * incohérents). On réhydrate pour garantir des entités alignées avec le code chargé.
 */
function rehydrateUser(user: User): User {
  const emailVo =
    user.email ??
    (user as unknown as { _props?: Partial<UserProps> })._props?.email;

  if (!emailVo) {
    throw new Error(
      `Utilisateur corrompu en mémoire (id=${user.id.value}) : email manquant. Redémarrez le serveur de dev pour réinitialiser le store.`,
    );
  }

  const emailString =
    typeof emailVo === "object" &&
    emailVo !== null &&
    "value" in emailVo &&
    typeof (emailVo as Email).value === "string"
      ? (emailVo as Email).value
      : String(emailVo);

  return User.restore(
    {
      name: user.name,
      email: Email.create(emailString),
      role: user.role,
    },
    user.id,
  );
}

export function getUsersStore(): User[] {
  ensureUsersStore();
  return globalForUsers.__inMemoryUsers__!;
}

export class InMemoryUsersRepository implements UsersRepository {
  findAll(): Promise<User[]> {
    return Promise.resolve(getUsersStore().map(rehydrateUser));
  }

  findById(id: UUID): Promise<User | null> {
    const found = getUsersStore().find((user) => user.id.equals(id)) ?? null;
    return Promise.resolve(found ? rehydrateUser(found) : null);
  }

  save(user: User): Promise<User> {
    const store = getUsersStore();
    const index = store.findIndex((u) => u.id.equals(user.id));
    if (index >= 0) {
      store[index] = user;
    } else {
      store.push(user);
    }
    return Promise.resolve(user);
  }
}
