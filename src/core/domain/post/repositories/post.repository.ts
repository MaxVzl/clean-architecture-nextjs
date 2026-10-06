import { Post } from "../entities/post.entity";

export interface PostRepository {
  save(post: Post): Promise<void>;
}
