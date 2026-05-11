import { UseCase } from "@/core/application/common/use-case.base";
import { CreatePostCommand } from "@/core/application/posts/commands/create-post.command";
import { SystemContext } from "@/core/application/common/contexts/system.context";
import { UUID } from "@/core/domain/common/value-objects/uuid.vo";
import { Post } from "@/core/domain/posts/entities/post.entity";
import { PostsRepository } from "@/core/domain/posts/repositories/posts.repository";
import { EmailService } from "@/core/application/common/services/email.service";

export interface CreatePostUseCaseDeps {
  postsRepository: PostsRepository;
  emailService: EmailService;
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
    await this.deps.emailService.send({
      to: "test@test.com",
      subject: "test test test",
      body: "body",
    });
    return post.id.value;
  }
}
