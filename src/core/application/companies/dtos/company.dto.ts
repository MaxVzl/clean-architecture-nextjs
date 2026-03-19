import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const companySchema = z.object({
  id: uuidSchema,
  name: z.string(),
  createdAt: z.date(),
});

export type CompanyDto = z.infer<typeof companySchema>;
