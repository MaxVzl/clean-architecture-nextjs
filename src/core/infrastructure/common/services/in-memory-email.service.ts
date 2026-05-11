import type { EmailService } from "@/core/application/common/services/email.service";

export interface SentEmail {
  to: string;
  subject: string;
  body: string;
}

export class InMemoryEmailService implements EmailService {
  private readonly sent: SentEmail[] = [];

  async send({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    return Promise.resolve(void this.sent.push({ to, subject, body }));
  }

  getSent(): readonly SentEmail[] {
    return this.sent;
  }

  clear(): void {
    this.sent.length = 0;
  }
}
