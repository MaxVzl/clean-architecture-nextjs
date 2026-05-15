import type { EmailService } from "@/core/application/common/services/email.service";
import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";

export class EmailAuthNotifierService implements AuthNotifierService {
  constructor(private readonly emailService: EmailService) {}

  async notifyPasswordReset(input: { to: string; url: string }): Promise<void> {
    await this.emailService.send({
      to: input.to,
      subject: `Password reset`,
      body: `Click <a href="${input.url}">here</a> to reset your password`,
    });
  }
}
