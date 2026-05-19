"use server";

import { createPostSchema } from "@/core/application/post/commands/create-post.command";
import { container } from "@/lib/container/container.prod";
import { authClient } from "@/lib/safe-action";

const { createPostUseCase } = container;

export const createPostAction = authClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput, ctx }) => {
    await createPostUseCase.execute(parsedInput, {
      userId: ctx.session.user.id,
    });
  });
