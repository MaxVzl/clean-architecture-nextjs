import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const softwareSchema = z.object({
  id: uuidSchema,
  companyId: uuidSchema,
  name: z.string(),
  websiteUrl: z.string(),
  category: z.string(),
});

export type SoftwareDto = z.infer<typeof softwareSchema>;
