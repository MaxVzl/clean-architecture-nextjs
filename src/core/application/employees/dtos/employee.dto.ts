import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { emailSchema } from "@/core/domain/employees/value-objects/email.vo";
import z from "zod";

export const employeeSchema = z.object({
  id: uuidSchema,
  companyId: uuidSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: emailSchema,
  isActive: z.boolean(),
});

export type EmployeeDto = z.infer<typeof employeeSchema>;
