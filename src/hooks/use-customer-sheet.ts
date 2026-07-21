"use client";

import { parseAsString, useQueryStates } from "nuqs";

export const useCustomerSheet = () => {
  return useQueryStates(
    {
      customerId: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    },
  );
};
