import { Schema } from "effect";

export const Money = Schema.Struct({
  amount: Schema.Number,
  currency: Schema.String,
}).pipe(Schema.brand("Money"));
export type Money = Schema.Schema.Type<typeof Money>;
