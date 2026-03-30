import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParams = {
  search: parseAsString.withDefault(""),
  offset: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

export const loadSearchParams = createLoader(searchParams);
