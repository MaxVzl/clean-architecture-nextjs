import { SystemContext } from "@/core/application/common/contexts/system.context";
import { CreatePostCommand } from "@/core/application/post/commands/create-post.command";
import { PostNotifierService } from "@/core/application/post/services/post-notifier.service";
import { Post } from "@/core/domain/post/entities/post.entity";
import { PostsRepository } from "@/core/domain/post/repositories/posts.repository";
import { UserNotFoundError } from "@/core/domain/user/errors/user-not-found.error";
import { UsersRepository } from "@/core/domain/user/repositories/users.repository";
import { UserId } from "@/core/domain/user/value-objects/user-id.vo";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
  usersRepository: UsersRepository;
  postNotifierService: PostNotifierService;
}

export class CreatePostUseCase {
  constructor(private readonly deps: CreatePostUseCaseDeps) {}

  async execute(
    command: CreatePostCommand,
    context: SystemContext,
  ): Promise<string> {
    const authorId = UserId.make(context.userId);
    const author = await this.deps.usersRepository.findById(authorId);
    if (!author) {
      throw new UserNotFoundError({ identifier: authorId.value });
    }
    const post = Post.create({
      authorId,
      title: command.title,
      description: command.description,
    });
    await this.deps.postsRepository.save(post);
    await this.deps.postNotifierService.notifyPostCreated({
      to: author.props.email.value,
      title: command.title,
      description: command.description,
    });
    return post.id.value;
  }
}
