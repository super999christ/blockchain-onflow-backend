import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
