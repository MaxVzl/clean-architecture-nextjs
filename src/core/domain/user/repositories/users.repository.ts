import { User } from "../entities/user.entity";
import { UserId } from "../value-objects/user-id.vo";

export interface UsersRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}
