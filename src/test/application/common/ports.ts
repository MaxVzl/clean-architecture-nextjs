import { QuoteId } from "@/test/domain/quote/vo/quote-id.vo";

export type Clock = () => Date;
export type IdGenerator = () => QuoteId;
