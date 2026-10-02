export type CustomerId = string & { readonly __brand: "CustomerId" };

export const makeCustomerId = (id: string): CustomerId => id as CustomerId;
