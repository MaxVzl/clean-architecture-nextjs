"use server";

import { createPostSchema } from "@/core/application/posts/commands/create-post.command";
import { actionClient } from "@/lib/safe-action";
import { sdk } from "@/lib/sdk";

export const createPostAction = actionClient
  .inputSchema(createPostSchema.omit({ userId: true }))
  .action(async ({ parsedInput }) => {
    await sdk.posts.create(parsedInput);
  });
