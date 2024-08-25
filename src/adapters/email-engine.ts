import nodemailer from 'nodemailer';
import { envs } from '../config/envs';

interface Attachment {
  filename: string;
  path: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export class EmailEngine {
  #transporter: nodemailer.Transporter;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      service: envs.MAILER_SERVICE,
      auth: {
        user: envs.MAILER_EMAIL,
        pass: envs.MAILER_API_KEY
      }
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const emailSent = await this.#transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        ...(attachments && { attachments })
      });

      if (!emailSent) {
        return false;
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return false;
    }
  }
}
