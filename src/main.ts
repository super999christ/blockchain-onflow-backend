import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import "./flow-config";
import setTestAccount from "./setup-test-accout";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setTestAccount("emulator-account");
  await app.listen(3000);
}
bootstrap();
