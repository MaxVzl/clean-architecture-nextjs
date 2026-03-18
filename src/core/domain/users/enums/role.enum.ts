export const Role = {
  ADMIN: "admin",
  MEMBER: "member",
  READER: "reader",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
