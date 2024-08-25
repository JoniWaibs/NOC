import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').asEmailString(),
  MAILER_API_KEY: env.get('MAILER_API_KEY').required().asString(),
  PORT: env.get('PORT').asPortNumber()
};
