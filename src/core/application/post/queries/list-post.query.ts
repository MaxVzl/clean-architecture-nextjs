import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const listPostQuerySchema = z.object({
  userId: uuidSchema.optional(),
  titleContains: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
});

export type ListPostQuery = z.infer<typeof listPostQuerySchema>;
