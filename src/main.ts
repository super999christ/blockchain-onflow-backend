import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import "./flow-config";
import setupTestAccount from "./setup-test-account";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  await setupTestAccount("emulator-account");
}
bootstrap();
