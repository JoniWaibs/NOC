// import { CronEngine } from '../adapters/cron-engine';
//import { EmailEngine } from '../adapters/email-engine';
// import { CheckService } from '../domains/use-cases/check-service';
import { EmailEngine } from '../adapters/email-engine';
import { SendLogsEmail } from '../domains/use-cases/send-logs-email';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system';
import { LogRepositoryImplementation } from '../infraestructure/repository/log.implementation';

const fileSystemLogImplementation = new LogRepositoryImplementation(
  // new LocalStorageDatasource();
  // new PostgreSQLDBDatasource();
  // new MongoDBatasource();
  new FileSystemDatasource()
);

const sendEmailLogsImplementation = new EmailEngine();

export class ServerApp {
  start(): void {
    console.log('Server started');
    //const baseUrl = 'https://fakestoreapi.com/products';

    new SendLogsEmail(
      fileSystemLogImplementation,
      sendEmailLogsImplementation,
      (message: string) => console.log(message),
      (error: string) => console.log(error)
    ).resolve(['joniwaibs@gmail.com']);

    // const checkService = new CheckService(
    //   fileSystemLogImplementation,
    //   (message: string) => console.log(message),
    //   (error: string) => console.log(error)
    // );

    // new CronEngine('*/1 * * * * *', () => checkService.resolve(baseUrl)).start();
  }
}
