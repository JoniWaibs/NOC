import { EmailEngine } from '../../adapters/email-engine';
import { LogEntityOrigin, LogSeverityLevel } from '../../enums';
import { LogEntity } from '../entities/log';
import { LogRepository } from '../repository/log';

interface SendLogsEmailUseCase {
  resolve(url: string | string[]): Promise<boolean>;
}

type OnSuccessCallback = (message: string) => void;

type OnErrorCallback = (error: string) => void;

export class SendLogsEmail implements SendLogsEmailUseCase {
  #onSuccessCallback: OnSuccessCallback;
  #onErrorCallback: OnErrorCallback;
  #logRepository: LogRepository;
  #email: EmailEngine;

  constructor(
    logRepository: LogRepository,
    emailEngine: EmailEngine,
    onSuccessCallback: OnSuccessCallback,
    onErrorCallback: OnErrorCallback
  ) {
    this.#onErrorCallback = onErrorCallback;
    this.#onSuccessCallback = onSuccessCallback;
    this.#logRepository = logRepository;
    this.#email = emailEngine;
  }

  async resolve(to: string | string[]): Promise<boolean> {
    const succesMessage = `Email was sent successfully`;
    const errorMessage = 'Something went wrong';

    if (!to) {
      throw new Error(errorMessage);
      // TODO: Validate email patter with regex
    }

    try {
      const emailSent = await this.#email.sendEmail({
        to,
        subject: 'NOC Bot',
        htmlBody: `
          <h2>Logs de sistema NOC</h2>
          </br>
          <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p> 
          <p>Ver logs adjuntos</p> 
        `,
        attachments: this.#getAttachments()
      });

      if (!emailSent) {
        throw new Error(errorMessage);
      }

      this.#onSuccessCallback(succesMessage);
      this.#logRepository.saveLog(
        new LogEntity({
          severityLevel: LogSeverityLevel.LOW,
          message: succesMessage,
          createdAt: new Date(),
          origin: LogEntityOrigin.CHECK_SERVICE
        })
      );
      return true;
    } catch (error: unknown) {
      this.#onErrorCallback(`Email was not sent - ${error}`);
      this.#logRepository.saveLog(
        new LogEntity({
          severityLevel: LogSeverityLevel.HIGH,
          message: `Email was not sent - ${error}`,
          createdAt: new Date(),
          origin: LogEntityOrigin.CHECK_SERVICE
        })
      );
      return false;
    }
  }

  #getAttachments() {
    return [
      { filename: 'all-level', path: './logs/all-level.log' },
      { filename: 'high-level', path: './logs/high-level.log' }
    ];
  }
}
