import z from "zod";

export const listUserPostsQuerySchema = z.object({
  userId: z.string(),
});

export type ListUserPostsQuery = z.infer<typeof listUserPostsQuerySchema>;
