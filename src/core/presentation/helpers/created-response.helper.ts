import z from "zod";

import { unauthorizedResponse } from "@/core/presentation/common/errors.type";

export const createdResponse = <T extends z.ZodType>(
  schema: T,
  description: string,
) => ({
  201: {
    content: { "application/json": { schema } },
    description,
  },
  401: unauthorizedResponse,
});
