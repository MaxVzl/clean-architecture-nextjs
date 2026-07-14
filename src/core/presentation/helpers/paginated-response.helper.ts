import z from "zod";

import { paginatedHeaders, unauthorizedResponse } from "../common/errors.type";

export const paginatedResponse = <T extends z.ZodType>(
  schema: T,
  description: string,
) => ({
  200: {
    content: { "application/json": { schema: z.array(schema) } },
    headers: paginatedHeaders,
    description,
  },
  400: unauthorizedResponse,
});
