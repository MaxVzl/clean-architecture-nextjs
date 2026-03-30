import z from "zod";

export const listUsersQuerySchema = z.object({
  params: z
    .object({
      search: z.string().optional(),
    })
    .optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
