"use server";

import {
  getUsersUseCase,
  createUserUseCase,
} from "@/factories/users.factories";
import { createUserSchema } from "@/core/application/users/dtos/create-user.dto";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const getUsersAction = actionClient.action(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await getUsersUseCase.execute();
});

export const createUserAction = actionClient
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = await createUserUseCase.execute(parsedInput);
    revalidatePath("/users");
    return user;
  });
