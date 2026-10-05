"use server";

import { createPostSchema } from "@/core/application/post/commands/create-post.command";
import { createPostUseCase } from "@/lib/container";
import { authClient } from "@/lib/safe-action";

export const createPostAction = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createPostUseCase.execute(parsedInput, {
      userId: ctx.session.user.id,
    });
  });
