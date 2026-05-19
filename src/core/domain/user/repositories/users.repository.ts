import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { User } from "../entities/user.entity";

export interface UsersRepository {
  findById(id: UUID): Promise<User | null>;
  save(user: User): Promise<void>;
}
