import { err, ok } from "neverthrow";
import { Resend } from "resend";

import type { EmailService } from "@/core2/application/common/services/email.service";

export type ResendEmailServiceDeps =
  | {
      /** Adresse expéditrice (ex. "App <onboarding@resend.dev>"). */
      from: string;
      resend: Resend;
    }
  | {
      from: string;
      /** Clé API Resend (`re_…`). */
      apiKey: string;
    };

export const makeResendEmailService = (
  deps: ResendEmailServiceDeps,
): EmailService => {
  const resend = "resend" in deps ? deps.resend : new Resend(deps.apiKey);

  return {
    send: async ({ to, subject, body }) => {
      const { error } = await resend.emails.send({
        from: deps.from,
        to,
        subject,
        html: body,
      });

      if (error) {
        return err({
          type: "EmailError",
          value:
            `${error.name}: ${error.message}` +
            (error.statusCode !== null ? ` (${error.statusCode})` : ""),
        });
      }
      return ok();
    },
  };
};
