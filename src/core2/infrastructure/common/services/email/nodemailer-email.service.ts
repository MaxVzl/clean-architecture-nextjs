import { ok } from "neverthrow";
import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type { EmailService } from "@/core2/application/common/services/email.service";

export type NodemailerEmailServiceDeps =
  | {
      /** Adresse expéditrice visible par les destinataires (ex. "App <noreply@example.com>"). */
      from: string;
      transporter: Transporter;
    }
  | {
      from: string;
      /** Options SMTP ou URL `smtp://…` passées à `nodemailer.createTransport`. */
      smtp: SMTPTransport.Options | string;
    };

export const makeNodemailerEmailService = (
  deps: NodemailerEmailServiceDeps,
): EmailService => {
  const transporter =
    "transporter" in deps
      ? deps.transporter
      : nodemailer.createTransport(deps.smtp);

  return {
    send: async ({ to, subject, body }) => {
      await transporter.sendMail({
        from: deps.from,
        to,
        subject,
        html: body,
      });
      return ok();
    },
  };
};
