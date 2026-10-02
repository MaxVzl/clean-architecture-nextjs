import { err, Result } from "neverthrow";

import { LineError } from "@/test/domain/quote/errors/quote.errors";
import {
  makeMoney,
  Money,
  multiplyMoney,
} from "@/test/domain/shared/vo/money.vo";

export type QuoteLine = {
  readonly label: string;
  readonly unitPrice: Money;
  readonly quantity: number;
};

export const makeQuoteLine = (input: {
  label: string;
  unitPrice: number;
  quantity: number;
}): Result<QuoteLine, LineError> => {
  const label = input.label.trim();
  if (label.length === 0) return err({ type: "EmptyLabel" });
  if (!Number.isInteger(input.quantity) || input.quantity <= 0)
    return err({ type: "InvalidQuantity", quantity: input.quantity });

  return makeMoney(input.unitPrice).map((unitPrice) => ({
    label,
    unitPrice,
    quantity: input.quantity,
  }));
};

export const lineTotal = (line: QuoteLine): Money =>
  multiplyMoney(line.unitPrice, line.quantity);
