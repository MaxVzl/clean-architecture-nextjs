import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { Role } from "@/core/domain/users/enums/role.enum";
import { emailSchema } from "@/core/domain/users/value-objects/email.vo";
import z from "zod";

export const userSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  email: emailSchema,
  role: z.enum(Role),
});

export type UserDto = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  name: z.string(),
  email: emailSchema,
  role: z.enum(Role),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
