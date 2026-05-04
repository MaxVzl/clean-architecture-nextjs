"use server";

import { createUserSchema } from "@/core/application/users/commands/create-user.command";
import { Role } from "@/core/domain/users/enums/role.enum";
import { container } from "@/lib/container/container.prod";
import { rolesClient } from "@/lib/safe-action";

const { createUserUseCase } = container;

export const createUserAction = rolesClient([Role.ADMIN])
  .inputSchema(createUserSchema)
  .action(async ({ parsedInput }) => {
    await createUserUseCase.execute(parsedInput);
  });
