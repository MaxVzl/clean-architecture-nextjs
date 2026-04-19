"use server";

import { createUserSchema } from "@/core/application/users/commands/create-user.command";
import { actionClient } from "@/lib/safe-action";
import { sdk } from "@/lib/sdk";

export const createUserAction = actionClient
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await sdk.public.users.create(parsedInput);
  });
