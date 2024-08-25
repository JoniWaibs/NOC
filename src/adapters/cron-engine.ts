import { CronJob } from 'cron';

type CronType = string | Date;
type CronOnTick = () => void;

export class CronEngine {
  private cronTime: CronType;
  private onTick: CronOnTick;

  constructor(cronTime: CronType, onTick: CronOnTick) {
    this.cronTime = cronTime;
    this.onTick = onTick;
  }

  private createJob() {
    return new CronJob(this.cronTime, this.onTick);
  }

  start(): void {
    this.createJob().start();
  }

  stop(): void {
    this.createJob().stop();
  }
}
