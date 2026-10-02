import { err, ok, Result } from "neverthrow";

import { Clock } from "@/test/application/common/ports";
import { send } from "@/test/domain/quote/entities/quote.entity";
import { SendError } from "@/test/domain/quote/errors/quote.errors";
import { QuoteRepository } from "@/test/domain/quote/repositories/quote.repository";
import { makeQuoteId } from "@/test/domain/quote/vo/quote-id.vo";

type Deps = {
  quotes: QuoteRepository;
  clock: Clock;
  notifier: QuoteNotifier;
  validityDays: number;
};

export const makeSendQuoteUseCase =
  (deps: Deps) =>
  async (command: { quoteId: string }): Promise<Result<void, SendError>> => {
    const id = makeQuoteId(command.quoteId);
    const quote = await deps.quotes.findById(id);

    if (!quote) return err({ type: "QuoteNotFound" });
    if (quote.status !== "draft")
      return err({ type: "QuoteNotDraft", status: quote.status });

    const { quote: sent, event } = send(quote, deps.clock(), deps.validityDays);

    await deps.quotes.save(sent);
    await deps.notifier.quoteSent(event);

    return ok(undefined);
  };
