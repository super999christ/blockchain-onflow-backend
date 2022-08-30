import { NestFactory } from '@nestjs/core';
import * as fcl from '@onflow/fcl';
import { AppModule } from './app.module';

// import './flow-config.js';
fcl
  .config()
  .put('accessNode.api', 'http://localhost:8888')
  .put('0xTokens', '0xf8d6e0586b0a20c7')
  .put('0xExampleNFT', '0x01cf0e2f2f715450')
  .put('discovery.wallet', 'http://localhost:3569/fcl/authn');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
