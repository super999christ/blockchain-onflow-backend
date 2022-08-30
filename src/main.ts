import { NestFactory } from '@nestjs/core';
import * as fcl from '@onflow/fcl';
import { AppModule } from './app.module';

import './flow-config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const currentUser = await fcl.authenticate();
  console.log('The Current User', currentUser);
}
bootstrap();
