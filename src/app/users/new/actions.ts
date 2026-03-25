"use server";

import { createUserSchema } from "@/core/application/users/dtos/create-user.dto";
import { actionClient } from "@/lib/safe-action";
import { sdk } from "@/lib/sdk";

export const createUserAction = actionClient
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await sdk.users.create({ data: parsedInput });
  });
