import { Clock, IdGenerator } from "@/test/application/common/ports";
import { makeCreateQuoteUseCase } from "@/test/application/quote/create-quote.use-case";
import { makeSendQuoteUseCase } from "@/test/application/quote/sent-quote.use-case";
import { QuoteRepository } from "@/test/domain/quote/repositories/quote.repository";

type QuoteModuleDeps = {
  quotes: QuoteRepository;
  clock: Clock;
  nextId: IdGenerator;
  notifier: QuoteNotifier;
  validityDays: number;
};

export const createQuoteModule = (deps: QuoteModuleDeps) => ({
  createQuote: makeCreateQuoteUseCase(deps),
  sendQuote: makeSendQuoteUseCase(deps),
});

export type QuoteModule = ReturnType<typeof createQuoteModule>;
