import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import FormatError from "easygraphql-format-error";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransactionModule } from "./transaction/transaction.module";

@Module({
  imports: [
    TransactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      installSubscriptionHandlers: true,
      formatError: (error) => {
        const formatError = new FormatError();
        return formatError.getError(error);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
