import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
}

export type CreatePostInput = CreatePostCommand & { userId: string };

export class CreatePostUseCase extends UseCase<
  CreatePostUseCaseDeps,
  string,
  CreatePostInput
> {
  async execute(input: CreatePostInput): Promise<string> {
    const post = Post.create({
      userId: UUID.create(input.userId),
      title: input.data.title,
      description: input.data.description,
    });
    await this.deps.postsRepository.save(post);
    return post.id.value;
  }
}
