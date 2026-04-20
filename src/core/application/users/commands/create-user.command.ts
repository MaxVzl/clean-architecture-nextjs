import { Role } from "@/core/domain/users/enums/role.enum";
import { emailSchema } from "@/core/domain/users/value-objects/email.vo";
import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: emailSchema,
  role: z.enum(Role),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;
