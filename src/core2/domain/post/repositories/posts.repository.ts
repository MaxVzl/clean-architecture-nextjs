import { Post } from "@/core2/domain/post/entities/post.entity";

export type PostsRepository = {
  save(post: Post): Promise<void>;
};
