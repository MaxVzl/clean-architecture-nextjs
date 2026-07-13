"use server";

import { createPostSchema } from "@/core/application/post/commands/create-post.command";
import { container } from "@/lib/container";
import { authClient } from "@/lib/safe-action";

export const createPostAction = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    await container.createPostUseCase.execute(parsedInput, {
      userId: ctx.session.user.id,
    });
  });
