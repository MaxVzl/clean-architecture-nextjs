import { Resend } from "resend";

import type { EmailService } from "@/core/application/common/services/email.service";

export type ResendEmailServiceConfig =
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

export class ResendEmailService implements EmailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(config: ResendEmailServiceConfig) {
    this.from = config.from;
    this.resend =
      "resend" in config ? config.resend : new Resend(config.apiKey);
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
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html: body,
    });

    if (error) {
      throw new Error(
        `${error.name}: ${error.message}` +
          (error.statusCode !== null ? ` (${error.statusCode})` : ""),
      );
    }
  }
}
