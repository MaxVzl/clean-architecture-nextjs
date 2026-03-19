export const Status = {
  ACTIVE: "active",
  TO_REVOKE: "to_revoke",
  REVOKED: "revoked",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
