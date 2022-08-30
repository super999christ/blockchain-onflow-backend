import { Injectable } from '@nestjs/common';
import * as fcl from '@onflow/fcl';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
