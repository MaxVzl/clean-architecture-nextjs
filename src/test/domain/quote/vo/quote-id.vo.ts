export type QuoteId = string & { readonly __brand: "QuoteId" };

export const makeQuoteId = (id: string): QuoteId => id as QuoteId;
