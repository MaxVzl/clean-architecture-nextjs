import z from "zod";

export const createPostSchema = z.object({
  userId: z.string(),
  data: z.object({
    title: z.string().min(1),
    description: z.string(),
  }),
});

export type CreatePostCommand = z.infer<typeof createPostSchema>;
