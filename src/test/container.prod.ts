import { randomUUID } from "crypto";

import { Clock, IdGenerator } from "@/test/application/common/ports";
import { createQuoteModule } from "@/test/application/quote/quote.module";
import { makeQuoteId } from "@/test/domain/quote/vo/quote-id.vo";
import { makeInMemoryQuoteRepository } from "@/test/infrastructure/quote/in-memory-quote.repository";

export const createContainer = () => {
  const quotes = makeInMemoryQuoteRepository();
  const clock: Clock = () => new Date();
  const nextId: IdGenerator = () => makeQuoteId(randomUUID());

  return {
    quote: createQuoteModule({
      quotes,
      clock,
      nextId,
      notifier: makeEmailQuoteNotifier(resend),
      validityDays: 30,
    }),
  };
};
