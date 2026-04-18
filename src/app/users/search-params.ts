import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/config/pagination";
import {
  createLoader,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  search: parseAsString.withDefault(""),
  offset: parseAsInteger.withDefault(1),
  limit: parseAsNumberLiteral(PAGE_SIZE_OPTIONS).withDefault(DEFAULT_PAGE_SIZE),
};

export const loadSearchParams = createLoader(searchParams);
