import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export type PostDto = z.infer<typeof postSchema>;
