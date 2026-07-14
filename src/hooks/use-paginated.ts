"use client";

import { parseAsInteger, parseAsNumberLiteral, useQueryStates } from "nuqs";

import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/config/pagination";

export const usePaginated = () => {
  return useQueryStates(
    {
      limit:
        parseAsNumberLiteral(PAGE_SIZE_OPTIONS).withDefault(DEFAULT_PAGE_SIZE),
      offset: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
    },
  );
};
