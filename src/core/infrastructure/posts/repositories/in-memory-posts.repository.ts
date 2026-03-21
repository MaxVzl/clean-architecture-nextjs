import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import { getUsersStore } from "@/core/infrastructure/users/repositories/in-memory-users.repository";

declare global {
  var __inMemoryPosts__: Post[] | undefined;
}

const users = getUsersStore();

const defaultPosts: Post[] = [
  Post.restore(
    {
      userId: users[0]!.id,
      title: "Post 1",
      description: "Content 1",
    },
    UUID.generate(),
  ),
  Post.restore(
    {
      userId: users[0]!.id,
      title: "Post 2",
      description: "Content 2",
    },
    UUID.generate(),
  ),
  Post.restore(
    {
      userId: users[1]!.id,
      title: "Post de Jane",
      description: "Description",
    },
    UUID.generate(),
  ),
];

const globalForPosts = globalThis as typeof globalThis & {
  __inMemoryPosts__?: Post[];
};

const postsStore: Post[] =
  globalForPosts.__inMemoryPosts__ ||
  (globalForPosts.__inMemoryPosts__ = [...defaultPosts]);

export class InMemoryPostsRepository implements PostsRepository {
  findByUserId(userId: UUID): Promise<Post[]> {
    return Promise.resolve(
      postsStore.filter((post) => post.userId.equals(userId)),
    );
  }
}
