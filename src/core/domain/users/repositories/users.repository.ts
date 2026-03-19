import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "../entities/user.entity";

export interface UsersRepository {
  getUsers(): Promise<User[]>;
  getUser(id: UUID): Promise<User | null>;
  createUser(user: User): Promise<User>;
}
