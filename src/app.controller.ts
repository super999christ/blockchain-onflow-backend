import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import * as fcl from '@onflow/fcl';

fcl
  .config()
  .put('accessNode.api', 'http://localhost:8080')
  .put('0xTokens', '0xf8d6e0586b0a20c7')
  .put('0xExampleNFT', '0x01cf0e2f2f715450')
  .put('discovery.wallet', 'http://localhost:3569/fcl/authn');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const result = await fcl.query({
      cadence: `
    import ExampleNFT from 0xExampleNFT

    pub fun main(): UInt64 {
      return ExampleNFT.totalSupply
    }
    `,
    });
    console.log(result);

    return this.appService.getHello();
  }
}
