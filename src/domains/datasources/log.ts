import { LogSeverityLevel } from '../../enums';
import { LogEntity } from '../entities/log';

export abstract class LogDatasource {
  abstract saveLog(log: LogEntity): Promise<void>;
  abstract getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
}
