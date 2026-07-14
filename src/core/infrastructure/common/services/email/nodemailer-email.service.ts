import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type { EmailService } from "@/core/application/common/services/email.service";

export type NodemailerEmailServiceConfig =
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

export class NodemailerEmailService implements EmailService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: NodemailerEmailServiceConfig) {
    this.from = config.from;
    this.transporter =
      "transporter" in config
        ? config.transporter
        : nodemailer.createTransport(config.smtp);
  }

  async send({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html: body,
    });
  }
}
