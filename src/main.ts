import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import './flow-config';
import './setup-test-accout';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
