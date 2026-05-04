"use server";

import { createPostSchema } from "@/core/application/posts/commands/create-post.command";
import { createPostUseCase } from "@/lib/factories";
import { authClient } from "@/lib/safe-action";

export const createPostAction = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createPostUseCase.execute(parsedInput, {
      userId: ctx.session.user.id,
    });
  });
