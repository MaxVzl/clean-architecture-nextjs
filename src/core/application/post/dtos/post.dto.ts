import { z } from "zod";

import { postIdSchema } from "@/core/domain/post/value-objects/post-id.vo";

export const postSchema = z.object({
  id: postIdSchema,
  title: z.string(),
  description: z.string(),
});

export type PostDto = z.infer<typeof postSchema>;
