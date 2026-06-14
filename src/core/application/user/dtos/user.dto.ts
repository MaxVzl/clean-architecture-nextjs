import { Role } from "@/core/domain/user/enums/role.enum";
import { emailSchema } from "@/core/domain/user/value-objects/email.vo";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: emailSchema,
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  role: z.enum(Role),
});

export type UserDto = z.infer<typeof userSchema>;
