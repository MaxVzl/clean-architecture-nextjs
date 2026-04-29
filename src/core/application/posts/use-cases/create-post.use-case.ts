import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { SystemContext } from "@/core/application/common/contexts/system.context";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
}

export class CreatePostUseCase extends UseCase<
  CreatePostUseCaseDeps,
  string,
  CreatePostCommand,
  SystemContext
> {
  async execute(
    command: CreatePostCommand,
    context: SystemContext,
  ): Promise<string> {
    const post = Post.create({
      userId: UUID.create(context.userId),
      title: command.title,
      description: command.description,
    });
    await this.deps.postsRepository.save(post);
    return post.id.value;
  }
}
