import { LogDatasource } from '../../domains/datasources/log';
import { LogEntity } from '../../domains/entities/log';
import { LogRepository } from '../../domains/repository/log';
import { LogSeverityLevel } from '../../enums';

export class LogRepositoryImplementation implements LogRepository {
  #logDataSource: LogDatasource;

  constructor(logDataSource: LogDatasource) {
    this.#logDataSource = logDataSource;
  }
  async saveLog(log: LogEntity): Promise<void> {
    this.#logDataSource.saveLog(log);
  }
  async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.#logDataSource.getLog(severityLevel);
  }
}
