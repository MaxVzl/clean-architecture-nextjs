import z from "zod";

export const postQueryFilterSchema = z.object({
  userId: z.string().optional(),
  titleContains: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
});

export type PostQueryFilter = z.infer<typeof postQueryFilterSchema>;
