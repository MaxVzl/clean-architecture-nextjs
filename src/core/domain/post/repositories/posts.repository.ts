import { Post } from "../entities/post.entity";

export interface PostsRepository {
  save(post: Post): Promise<void>;
}
