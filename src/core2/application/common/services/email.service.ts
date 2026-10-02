import { Result } from "neverthrow";

import { EmailError } from "@/core2/application/common/errors/email.error";

export type EmailService = {
  send(input: {
    to: string;
    subject: string;
    body: string;
  }): Promise<Result<void, EmailError>>;
};
