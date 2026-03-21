import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "../entities/post.entity";

export interface PostsRepository {
  findByUserId(userId: UUID): Promise<Post[]>;
}
