"use server";

import { createUserSchema } from "@/core/application/users/commands/create-user.command";
import { Role } from "@/core/domain/users/enums/role.enum";
import { createUserUseCase } from "@/lib/factories";
import { rolesClient } from "@/lib/safe-action";

export const createUserAction = rolesClient([Role.ADMIN])
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await createUserUseCase.execute(parsedInput);
  });
