"use client";

import { useQueryStates, parseAsInteger } from "nuqs";

export const usePaginated = () => {
  return useQueryStates(
    {
      limit: parseAsInteger.withDefault(10),
      offset: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
    },
  );
};
