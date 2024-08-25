import { LogSeverityLevel } from '../../enums';

export interface LogEntityOptions {
  severityLevel: LogSeverityLevel;
  message: string;
  createdAt: Date;
  origin: string;
}

export class LogEntity {
  severityLevel: LogSeverityLevel;
  message: string;
  createdAt: Date;
  origin: string;

  constructor(options: LogEntityOptions) {
    const { severityLevel, message, createdAt = new Date(), origin } = options;

    this.severityLevel = severityLevel;
    this.message = message;
    this.createdAt = createdAt;
    this.origin = origin;
  }

  static fromJSON(json: string): LogEntity {
    const parsedLog = JSON.parse(json);

    if (!parsedLog) {
      throw Error('Missing log');
    }

    const { message, severityLevel, createdAt, origin } = parsedLog;
    const log = new LogEntity({ message, severityLevel, createdAt, origin });
    return log;
  }
}
