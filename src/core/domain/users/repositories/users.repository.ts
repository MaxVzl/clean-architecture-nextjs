import { User } from "../entities/user.entity";

export interface UsersRepository {
  getUsers(): Promise<User[]>;
  createUser(user: User): Promise<User>;
}
