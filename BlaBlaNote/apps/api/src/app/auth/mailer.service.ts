import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  async sendPasswordResetEmail(email: string, resetLink: string) {
    // Plug your real provider implementation here.
    this.logger.log(`Password reset link sent to ${email}: ${resetLink}`);
  }
}
