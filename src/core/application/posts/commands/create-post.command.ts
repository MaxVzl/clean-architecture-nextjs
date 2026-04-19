import z from "zod";

export const createPostSchema = z.object({
  data: z.object({
    title: z.string().min(1),
    description: z.string(),
  }),
});

export type CreatePostCommand = z.infer<typeof createPostSchema>;
