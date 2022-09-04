import { Injectable } from "@nestjs/common";
import * as fcl from "@onflow/fcl";

import { NFT } from "./types/nft.types";
import { authorizationFunction } from "../flow-auth";
import Flow from "../../flow.json";
import {
  mintTx,
  findManyTx,
  findOneTx,
  burnTx,
  transferTx,
} from "../../cadence/transactions/apis";

@Injectable()
export class TransactionService {
  authrization = authorizationFunction(
    Flow.accounts["dev-account"].address,
    Flow.accounts["dev-account"].key
  ); // authentication
  devAddress = `0x${Flow.accounts["dev-account"].address}`;

  //  Returns Test String
  test(): string {
    return "GraphQL: Transaction works";
  }

  //  Creates an NFT on the blockchain and returns transactionID
  async mint(
    name: string,
    description: string,
    thumbnail: string
  ): Promise<string> {
    // execute mutation
    const transactionId = await fcl.mutate({
      cadence: mintTx,
      args: (arg, t) => [
        arg(name, t.String),
        arg(description, t.String),
        arg(thumbnail, t.String),
      ],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    return transactionId;
  }

  //  Get NFT datas from given account on the Blockchain
  async findMany(
    address: string,
    limit: number = 5,
    offset: number = 0
  ): Promise<NFT[]> {
    // execute query
    const datas = await fcl.query({
      cadence: findManyTx,
      args: (arg, t) => [arg(address || this.devAddress, t.Address)],
    });

    const processedData = datas.map((item) => {
      item.file = {
        url: item.thumbnail,
      };
      return item;
    });

    const result = processedData.slice(offset * limit, (offset + 1) * limit);
    return result;
  }

  //  Get NFT data from give account with given id on the Blockchain
  async findOne(id: number, address: string): Promise<NFT> {
    // execute query
    const data = await fcl.query({
      cadence: findOneTx,
      args: (arg, t) => [
        arg(id.toString(), t.UInt64),
        arg(address ? address : this.devAddress, t.Address),
      ],
    });
    data.file = {
      url: data.thumbnail,
    };
    return data;
  }

  //  Erase the NFT data from Blockchain
  async burn(id: number): Promise<string> {
    // excute mutation
    const transactionId = await fcl.mutate({
      cadence: burnTx,
      args: (arg, t) => [arg(id.toString(), t.UInt64)],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    return transactionId;
  }

  //  Trnasfer NFT with id to receiver address
  async transfer(id: number, receiver: string): Promise<string> {
    // excute mutation
    const transactionId = await fcl.mutate({
      cadence: transferTx,
      args: (arg, t) => [arg(id, t.UInt64), arg(receiver, t.Address)],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    return transactionId;
  }
}
