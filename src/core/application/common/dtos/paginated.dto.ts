import { z } from "zod";

export const paginatedSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    data: z.array(data),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
  });

export interface PaginatedDto<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}
