"use client";

import { useQueryStates, parseAsString } from "nuqs";

export const useSearchUsers = () => {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    },
  );
};
