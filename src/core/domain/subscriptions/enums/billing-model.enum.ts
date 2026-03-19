export const BillingModel = {
  INDIVIDUAL: "individual",
  PER_SEAT: "per_seat",
  FLAT_FEE: "flat_fee",
  SHARED: "shared",
} as const;

export type BillingModel = (typeof BillingModel)[keyof typeof BillingModel];
