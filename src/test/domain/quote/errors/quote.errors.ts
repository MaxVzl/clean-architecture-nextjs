import { Quote } from "@/test/domain/quote/entities/quote.entity";

export type QuoteError = { type: "QuoteExpired"; expiredAt: Date };

export type LineError =
  | { type: "NoLines" }
  | { type: "EmptyLabel" }
  | { type: "InvalidQuantity"; quantity: number }
  | { type: "InvalidAmount"; cents: number };

export type SendError =
  | { type: "QuoteNotFound" }
  | { type: "QuoteNotDraft"; status: Quote["status"] };
export type AcceptError = { type: "QuoteExpired"; expiredAt: Date };

export type CreateQuoteError =
  | LineError
  | { type: "InvalidCustomerId"; value: string };
