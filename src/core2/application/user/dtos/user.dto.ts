import { z } from "zod";

import { uuidSchema } from "@/core2/domain/common/value-objects/uuid.vo";
import { Role } from "@/core2/domain/user/enums/role.enum";
import { emailSchema } from "@/core2/domain/user/value-objects/email.vo";

export const userSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  email: emailSchema,
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  role: z.enum(Role),
});

export type UserDto = z.infer<typeof userSchema>;
