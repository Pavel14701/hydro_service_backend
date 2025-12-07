import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IMailService } from '../application/mail.adapter.interface';

@Injectable()
export class MailService implements IMailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
    } = process.env;

    if (!SMTP_HOST) {
      throw new Error('SMTP_HOST env variable is required for MailService.');
    }
    if (!SMTP_PORT) {
      throw new Error('SMTP_PORT env variable is required for MailService.');
    }
    const port = Number(SMTP_PORT);
    if (!Number.isInteger(port) || port <= 0) {
      throw new Error(`SMTP_PORT must be a positive integer. Received: "${SMTP_PORT}".`);
    }
    if (SMTP_SECURE !== 'true' && SMTP_SECURE !== 'false') {
      throw new Error('SMTP_SECURE must be "true" or "false".');
    }
    if (!SMTP_USER) {
      throw new Error('SMTP_USER env variable is required for MailService.');
    }
    if (!SMTP_PASS) {
      throw new Error('SMTP_PASS env variable is required for MailService.');
    }
    if (!SMTP_FROM) {
      throw new Error('SMTP_FROM env variable is required for MailService.');
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }
}
