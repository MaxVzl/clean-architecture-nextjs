import z from "zod";

import { Role } from "@/core/domain/user/enums/role.enum";
import { emailSchema } from "@/core/domain/user/value-objects/email.vo";
import { userNameSchema } from "@/core/domain/user/value-objects/user-name.vo";

export const createUserSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  role: z.enum(Role),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;
