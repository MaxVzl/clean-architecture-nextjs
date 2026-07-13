import type { Context, Env, Input } from "hono";

type ValidKey<I extends Input> = keyof I["out"] & ("query" | "param" | "json");

type DepsFromInput<E extends Env, P extends string, I extends Input> = {
  c: Context<E, P, I>;
} & ("query" extends keyof I["out"] ? { query: I["out"]["query"] } : {}) &
  ("param" extends keyof I["out"] ? { params: I["out"]["param"] } : {}) &
  ("json" extends keyof I["out"] ? { body: I["out"]["json"] } : {});

export const validController = <
  E extends Env,
  P extends string,
  I extends Input,
>(
  c: Context<E, P, I>,
): DepsFromInput<E, P, I> =>
  ({
    c,
    query: c.req.valid("query" as Extract<ValidKey<I>, "query">),
    params: c.req.valid("param" as Extract<ValidKey<I>, "param">),
    body: c.req.valid("json" as Extract<ValidKey<I>, "json">),
  }) as DepsFromInput<E, P, I>;
