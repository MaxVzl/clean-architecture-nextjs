"use server";

import { createUserSchema } from "@/core/application/user/commands/create-user.command";
import { Role } from "@/core/domain/user/enums/role.enum";
import { createUserUseCase } from "@/lib/container";
import { rolesClient } from "@/lib/safe-action";

export const createUserAction = rolesClient([Role.ADMIN])
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await createUserUseCase.execute(parsedInput);
  });
