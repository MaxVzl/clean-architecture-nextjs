import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "@/core/domain/users/entities/user.entity";
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

const usersStore: User[] =
  globalForUsers.__inMemoryUsers__ ||
  (globalForUsers.__inMemoryUsers__ = [...defaultUsers]);

export class InMemoryUsersRepository implements UsersRepository {
  getUsers(): Promise<User[]> {
    return Promise.resolve(usersStore);
  }

  createUser(user: User): Promise<User> {
    usersStore.push(user);
    return Promise.resolve(user);
  }
}
