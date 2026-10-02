import { UUID } from "@/core2/domain/common/value-objects/uuid.vo";
import { User } from "@/core2/domain/user/entities/user.entity";

export type UsersRepository = {
  findById(id: UUID): Promise<User | null>;
  save(user: User): Promise<void>;
};
