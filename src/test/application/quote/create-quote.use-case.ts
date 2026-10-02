import { err, ok, Result } from "neverthrow";

import { Clock, IdGenerator } from "@/test/application/common/ports";
import { makeCustomerId } from "@/test/domain/customer/vo/customer-id.vo";
import { createQuote } from "@/test/domain/quote/entities/quote.entity";
import { CreateQuoteError } from "@/test/domain/quote/errors/quote.errors";
import { QuoteRepository } from "@/test/domain/quote/repositories/quote.repository";
import { QuoteId } from "@/test/domain/quote/vo/quote-id.vo";
import { makeQuoteLine, QuoteLine } from "@/test/domain/quote/vo/quote-line.vo";

type NonEmptyArray<T> = [T, ...T[]];

type Deps = {
  quotes: QuoteRepository;
  clock: Clock;
  nextId: IdGenerator;
};

type Command = {
  customerId: string;
  lines: { label: string; unitPrice: number; quantity: number }[];
};

export const makeCreateQuoteUseCase =
  (deps: Deps) =>
  async (command: Command): Promise<Result<QuoteId, CreateQuoteError>> => {
    if (command.lines.length === 0) return err({ type: "NoLines" });

    const validLines: QuoteLine[] = [];
    command.lines.map(makeQuoteLine).forEach((line) => {
      if (line.isErr()) return err(line.error);
      validLines.push(line.value);
    });

    const quote = createQuote({
      id: deps.nextId(),
      customerId: makeCustomerId(command.customerId),
      lines: validLines as NonEmptyArray<QuoteLine>,
    });

    await deps.quotes.save(quote);
    return ok(quote.id);
  };
