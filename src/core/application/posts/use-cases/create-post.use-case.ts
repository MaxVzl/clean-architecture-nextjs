import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
}

export class CreatePostUseCase extends UseCase<
  CreatePostUseCaseDeps,
  string,
  CreatePostCommand
> {
  async execute(command: CreatePostCommand): Promise<string> {
    const post = Post.create({
      userId: UUID.create(command.userId),
      title: command.data.title,
      description: command.data.description,
    });
    await this.deps.postsRepository.save(post);
    return post.id.value;
  }
}
