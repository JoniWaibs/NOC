import { LogEntityOrigin, LogSeverityLevel } from '../../enums';
import { LogEntity } from '../entities/log';
import { LogRepository } from '../repository/log';

interface CheckServiceUseCase {
  resolve(url: string): Promise<boolean>;
}

type OnSuccessCallback = (message: string) => void;

type OnErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
  #onSuccessCallback: OnSuccessCallback;
  #onErrorCallback: OnErrorCallback;
  #logRepository: LogRepository;

  constructor(logRepository: LogRepository, onSuccessCallback: OnSuccessCallback, onErrorCallback: OnErrorCallback) {
    this.#onErrorCallback = onErrorCallback;
    this.#onSuccessCallback = onSuccessCallback;
    this.#logRepository = logRepository;
  }

  async resolve(url: string): Promise<boolean> {
    const succesMessage = `Request from ${url}: is Ok`;
    const errorMessage = 'Something went wrong';

    try {
      const request = await fetch(url);

      if (!request.ok) {
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
      this.#onErrorCallback(`${error}`);
      this.#logRepository.saveLog(
        new LogEntity({
          severityLevel: LogSeverityLevel.HIGH,
          message: `Service could not be verified - ${error}`,
          createdAt: new Date(),
          origin: LogEntityOrigin.CHECK_SERVICE
        })
      );
      return false;
    }
  }
}
