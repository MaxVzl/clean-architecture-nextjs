import z from "zod";

import { Role } from "@/core2/domain/user/enums/role.enum";
import { emailSchema } from "@/core2/domain/user/value-objects/email.vo";

export const createUserSchema = z.object({
  name: z.string(),
  email: emailSchema,
  role: z.enum(Role),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;
