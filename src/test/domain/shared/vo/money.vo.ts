import { err, ok, Result } from "neverthrow";

import { LineError } from "@/test/domain/quote/errors/quote.errors";

export type Money = number & { readonly __brand: "Money" }; // centimes

export const makeMoney = (cents: number): Result<Money, LineError> =>
  Number.isInteger(cents) && cents >= 0
    ? ok(cents as Money)
    : err({ type: "InvalidAmount", cents });

export const addMoney = (a: Money, b: Money): Money => (a + b) as Money;
export const multiplyMoney = (m: Money, q: number): Money => (m * q) as Money;
