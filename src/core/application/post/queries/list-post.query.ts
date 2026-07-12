import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const listPostQuerySchema = z.object({
  userId: uuidSchema.optional(),
  titleContains: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type ListPostQuery = z.infer<typeof listPostQuerySchema>;
