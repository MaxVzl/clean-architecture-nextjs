"use server";

import { createUserUseCase } from "@/factories/users.factories";
import { createUserSchema } from "@/core/application/users/dtos/create-user.dto";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const createUserAction = actionClient
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    const user = await createUserUseCase.execute(parsedInput);
    revalidatePath("/users");
    return user;
  });
