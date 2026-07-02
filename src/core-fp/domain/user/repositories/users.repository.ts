import { User } from "../entities/user.entity";

export type UsersRepository = {
  findById: (id: string) => Promise<User | null>;
  create: (user: User) => Promise<User>;
};
