import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import { Status } from "@/core/domain/license-assignments/enums/status.enum";
import z from "zod";

export const licenseAssignmentSchema = z.object({
  id: uuidSchema,
  employeeId: uuidSchema,
  subscriptionId: uuidSchema,
  status: z.enum(Status),
});

export type LicenseAssignmentDto = z.infer<typeof licenseAssignmentSchema>;
