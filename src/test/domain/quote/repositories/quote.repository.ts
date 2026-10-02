import { Quote } from "@/test/domain/quote/entities/quote.entity";
import { QuoteId } from "@/test/domain/quote/vo/quote-id.vo";

export type QuoteRepository = {
  findById: (id: QuoteId) => Promise<Quote | null>;
  save: (quote: Quote) => Promise<void>;
};
