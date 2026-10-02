import { Quote } from "@/test/domain/quote/entities/quote.entity";
import { QuoteRepository } from "@/test/domain/quote/repositories/quote.repository";
import { QuoteId } from "@/test/domain/quote/vo/quote-id.vo";

const quotes = new Map<QuoteId, Quote>();

export const makeInMemoryQuoteRepository = (): QuoteRepository => ({
  findById: async (id) => quotes.get(id) ?? null,
  save: async (quote) => {
    quotes.set(quote.id, quote);
  },
});
