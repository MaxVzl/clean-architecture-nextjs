const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

import { err, ok, Result } from "neverthrow";

import { CustomerId } from "@/test/domain/customer/vo/customer-id.vo";
import { QuoteError } from "@/test/domain/quote/errors/quote.errors";
import { QuoteId } from "@/test/domain/quote/vo/quote-id.vo";
import { lineTotal, QuoteLine } from "@/test/domain/quote/vo/quote-line.vo";
import { addMoney, makeMoney, Money } from "@/test/domain/shared/vo/money.vo";

type NonEmptyArray<T> = [T, ...T[]];

type QuoteBase = {
  id: QuoteId;
  customerId: CustomerId;
  lines: NonEmptyArray<QuoteLine>;
};

type DraftQuote = QuoteBase & { status: "draft" };
type SentQuote = QuoteBase & { status: "sent"; sentAt: Date; expiresAt: Date };
type AcceptedQuote = QuoteBase & {
  status: "accepted";
  sentAt: Date;
  acceptedAt: Date;
};
type RefusedQuote = QuoteBase & {
  status: "refused";
  sentAt: Date;
  refusedAt: Date;
};

export type Quote = DraftQuote | SentQuote | AcceptedQuote | RefusedQuote;

export const createQuote = (input: {
  id: QuoteId;
  customerId: CustomerId;
  lines: NonEmptyArray<QuoteLine>;
}): DraftQuote => ({
  status: "draft",
  id: input.id,
  customerId: input.customerId,
  lines: input.lines,
});

export const quoteTotal = (quote: Quote): Money =>
  quote.lines.map(lineTotal).reduce(addMoney, makeMoney(0));

export const addLine = (quote: DraftQuote, line: QuoteLine): DraftQuote => ({
  ...quote,
  lines: [...quote.lines, line],
});

export const removeLine = (
  quote: DraftQuote,
  label: string,
): Result<DraftQuote, QuoteError> => {
  const lines = quote.lines.filter((l) => l.label !== label);
  if (lines.length === 0) return err({ type: "NoLines" });
  return ok({ ...quote, lines: lines as NonEmptyArray<QuoteLine> });
};

export const send = (
  quote: DraftQuote,
  now: Date,
  validityDays: number,
): { quote: SentQuote; event: QuoteSent } => {
  const sent: SentQuote = {
    ...quote,
    status: "sent",
    sentAt: now,
    expiresAt: addDays(now, validityDays),
  };
  return {
    quote: sent,
    event: {
      type: "QuoteSent",
      quoteId: quote.id,
      total: quoteTotal(sent),
      at: now,
    },
  };
};

export const isExpired = (quote: SentQuote, now: Date): boolean =>
  now > quote.expiresAt;

export const accept = (
  quote: SentQuote,
  now: Date,
): Result<AcceptedQuote, QuoteError> => {
  if (isExpired(quote, now))
    return err({ type: "QuoteExpired", expiredAt: quote.expiresAt });
  return ok({
    status: "accepted",
    id: quote.id,
    customerId: quote.customerId,
    lines: quote.lines,
    sentAt: quote.sentAt,
    acceptedAt: now,
  });
};
