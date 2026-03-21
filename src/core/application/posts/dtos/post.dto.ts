import { uuidSchema } from "@/core/domain/common/value-objects/uuid.vo";
import z from "zod";

export const postSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  description: z.string(),
});

export type PostDto = z.infer<typeof postSchema>;
