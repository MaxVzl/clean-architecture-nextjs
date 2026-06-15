import { Context } from "hono"

export const getPagination = (c: Context) => {
  return {
    limit: c.req.query("limit") ? parseInt(c.req.query("limit") as string) : undefined,
    offset: c.req.query("offset") ? parseInt(c.req.query("offset") as string) : undefined,
  }
}