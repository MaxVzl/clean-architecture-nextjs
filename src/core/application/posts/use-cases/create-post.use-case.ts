import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { SystemContext } from "@/core/application/common/contexts/system.context";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import { UsersRepository } from "@/core/domain/users/repositories/users.repository";
import { UserNotFoundError } from "@/core/domain/users/errors/user-not-found.error";
import { PostNotifierService } from "@/core/application/posts/services/post-notifier.service";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
  usersRepository: UsersRepository;
  postNotifierService: PostNotifierService;
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
    const user = await this.deps.usersRepository.findById(
      UUID.create(context.userId),
    );
    if (!user) {
      throw new UserNotFoundError({ identifier: context.userId });
    }
    const post = Post.create({
      userId: UUID.create(context.userId),
      title: command.title,
      description: command.description,
    });
    await this.deps.postsRepository.save(post);
    await this.deps.postNotifierService.notifyPostCreated({
      to: user.email.value,
      title: command.title,
      description: command.description,
    });
    return post.id.value;
  }
}
