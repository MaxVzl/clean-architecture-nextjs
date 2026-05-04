import z from "zod";

export const listUsersQuerySchema = z.object({
  nameContains: z.string().optional(),
  emailContains: z.string().optional(),
  pagination: z
    .object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    })
    .optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
