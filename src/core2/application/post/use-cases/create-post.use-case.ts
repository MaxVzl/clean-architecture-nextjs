import { errAsync, ResultAsync } from "neverthrow";

import { SystemContext } from "@/core2/application/common/contexts/system.context";
import { CreatePostCommand } from "@/core2/application/post/commands/create-post.command";
import { CreatePostError } from "@/core2/application/post/errors/post.errors";
import { PostNotifierService } from "@/core2/application/post/services/post-notifier.service";
import { makeUUID } from "@/core2/domain/common/value-objects/uuid.vo";
import { createPost } from "@/core2/domain/post/entities/post.entity";
import { PostsRepository } from "@/core2/domain/post/repositories/posts.repository";
import { UserNotFoundError } from "@/core2/domain/user/errors/user.errors";
import { UsersRepository } from "@/core2/domain/user/repositories/users.repository";

export type CreatePostUseCaseDeps = {
  postsRepository: PostsRepository;
  usersRepository: UsersRepository;
  postNotifierService: PostNotifierService;
};

export const makeCreatePostUseCase = (deps: CreatePostUseCaseDeps) => {
  return (
    command: CreatePostCommand,
    context: SystemContext,
  ): ResultAsync<string, CreatePostError> => {
    return makeUUID(context.userId).asyncAndThen((userId) =>
      ResultAsync.fromSafePromise(
        deps.usersRepository.findById(userId),
      ).andThen((user) => {
        if (!user) {
          return errAsync<never, UserNotFoundError>({
            type: "UserNotFound",
            identifier: userId,
          });
        }

        return createPost({
          userId: user.id,
          title: command.title,
          description: command.description,
        }).asyncMap(async (post) => {
          await deps.postsRepository.save(post);
          await deps.postNotifierService.notifyPostCreated({
            to: user.email,
            title: command.title,
            description: command.description,
          });
          return post.id;
        });
      }),
    );
  };
};
