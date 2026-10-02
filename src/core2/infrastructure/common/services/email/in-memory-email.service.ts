import { ok } from "neverthrow";

import type { EmailService } from "@/core2/application/common/services/email.service";

export type SentEmail = {
  to: string;
  subject: string;
  body: string;
};

export type InMemoryEmailService = EmailService & {
  getSent: () => readonly SentEmail[];
  clear: () => void;
};

export const makeInMemoryEmailService = (): InMemoryEmailService => {
  const sent: SentEmail[] = [];

  return {
    send: async ({ to, subject, body }) => {
      console.log(body);
      sent.push({ to, subject, body });
      return ok();
    },
    getSent: () => sent,
    clear: () => {
      sent.length = 0;
    },
  };
};
