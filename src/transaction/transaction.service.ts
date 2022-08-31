//  External Dependencies
import { Injectable } from '@nestjs/common';
import * as fcl from '@onflow/fcl';

//  Internal Dependencies
import { NFT } from './types/nft.types';
import { authorizationFunction } from '../flow-auth';
import {
  mintTx,
  findManyTx,
  findOneTx,
  burnTx,
  transferTx,
} from '../../cadence/transactions/apis';

@Injectable()
export class TransactionService {
  authrization = authorizationFunction(); // authentication

  //  Returns Test String
  test(): string {
    return 'GraphQL: Transaction works';
  }

  //  Create the NFT on the blockchain and return the transactionID
  async mint(
    name: string,
    description: string,
    thumbnail: string,
  ): Promise<string> {
    // excute the mutation
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

    await fcl.tx(transactionId).subscribe((res) => {
      // console.log(res);
    });
    return transactionId;
  }

  //  Get NFT datas from given account on the Blockchain
  async findMany(
    address: string,
    limit: number,
    offset: number,
  ): Promise<NFT[]> {
    // excute the query
    const datas = await fcl.query({
      cadence: findManyTx,
      args: (arg, t) => [arg(address, t.Address)],
    });

    const processedData = datas.map((item) => {
      item.file = {};
      item.file.url = item.thumbnail;
      return item;
    });

    const result = [];
    for (
      let i = offset * limit;
      i <
      ((offset + 1) * limit < processedData.length
        ? (offset + 1) * limit
        : processedData.length);
      i++
    ) {
      result.push(processedData[i]);
    }

    return result;
  }

  //  Get NFT data from give account with given id on the Blockchain
  async findOne(id: number, address: string): Promise<NFT> {
    const data = await fcl.query({
      cadence: findOneTx,
      args: (arg, t) => [arg(id.toString(), t.UInt64), arg(address, t.Address)],
    });
    data.file = {};
    data.file.url = data.thumbnail;
    return data;
  }

  //  Erase the NFT data from Blockchain
  async burn(id: number): Promise<string> {
    // excute the mutation
    const transactionId = await fcl.mutate({
      cadence: burnTx,
      args: (arg, t) => [arg(id.toString(), t.UInt64)],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    await fcl.tx(transactionId).subscribe((res) => {
      // console.log(res);
    });
    return transactionId;
  }

  //  Trnasfer NFT with id to receiver address
  async transfer(id: number, receiver: string): Promise<string> {
    // excute the mutation
    const transactionId = await fcl.mutate({
      cadence: transferTx,
      args: (arg, t) => [arg(id, t.UInt64), arg(receiver, t.Address)],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    await fcl.tx(transactionId).subscribe((res) => {
      // console.log(res);
    });
    return transactionId;
  }
}
