import { existsSync, mkdirSync, appendFileSync, readFileSync, writeFileSync } from 'fs';
import { LogDatasource } from '../../domains/datasources/log';
import { LogEntity } from '../../domains/entities/log';
import { LogSeverityLevel } from '../../enums';

export class FileSystemDatasource implements LogDatasource {
  private readonly baseLogsPath: string = 'logs/';
  private readonly allLogsPath: string = 'logs/all-level.log';
  private readonly mediumLogsPath: string = 'logs/medium-level.log';
  private readonly highLogsPath: string = 'logs/high-level.log';

  constructor() {
    this.#createLogsFiles();
  }

  #createLogsFiles() {
    if (!existsSync(this.baseLogsPath)) {
      mkdirSync(this.baseLogsPath);
    }
    [this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach((path) => {
      if (existsSync(path)) return;
      try {
        writeFileSync(path, '');
      } catch (error) {
        throw Error(`Something went wrong tryng to create dir - ${error}`);
      }
    });
  }

  #getLogsFromFile(path: string): LogEntity[] {
    return readFileSync(path, 'utf-8')
      .split('\n')
      .map((log) => LogEntity.fromJSON(log));
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const logAsJSON = `${JSON.stringify(newLog)}\n`;

    appendFileSync(this.allLogsPath, logAsJSON);

    const saveLogBySeverity: Record<LogSeverityLevel, () => void | null> = {
      [LogSeverityLevel.MEDIUM]: () => appendFileSync(this.mediumLogsPath, logAsJSON),
      [LogSeverityLevel.HIGH]: () => appendFileSync(this.highLogsPath, logAsJSON),
      [LogSeverityLevel.LOW]: () => null // -> Low logs are saved in allLogsPath, in line 33. This file has all logs severities [LOW, MEDIUM, HIGH]
    };

    saveLogBySeverity[newLog.severityLevel]();
  }

  async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const getLogBySeverity: Record<LogSeverityLevel, () => LogEntity[]> = {
      [LogSeverityLevel.MEDIUM]: () => this.#getLogsFromFile(this.mediumLogsPath),
      [LogSeverityLevel.HIGH]: () => this.#getLogsFromFile(this.highLogsPath),
      [LogSeverityLevel.LOW]: () => this.#getLogsFromFile(this.allLogsPath)
    };

    return getLogBySeverity[severityLevel]();
  }
}
