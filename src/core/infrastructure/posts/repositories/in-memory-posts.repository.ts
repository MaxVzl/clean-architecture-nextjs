import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import { readJsonArray } from "@/core/infrastructure/database/json-file-store";

const POSTS_FILE = "posts.json";

type PostJsonRow = {
  id: string;
  userId: string;
  title: string;
  description: string;
};

export class InMemoryPostsRepository implements PostsRepository {
  async findByUserId(userId: UUID): Promise<Post[]> {
    const rows = await readJsonArray<PostJsonRow>(POSTS_FILE);
    return rows
      .filter((row) => row.userId === userId.value)
      .map((row) =>
        Post.restore(
          {
            userId: UUID.create(row.userId),
            title: row.title,
            description: row.description,
          },
          UUID.create(row.id),
        ),
      );
  }
}
