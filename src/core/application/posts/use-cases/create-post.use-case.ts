import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { UserPostContext } from "@/core/application/posts/contexts/user-post.context";
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
  UserPostContext
> {
  async execute(
    command: CreatePostCommand,
    context: UserPostContext,
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
