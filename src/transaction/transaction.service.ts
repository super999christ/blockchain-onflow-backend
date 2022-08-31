//  External Dependencies
import { Injectable } from "@nestjs/common";
import * as fcl from "@onflow/fcl";

//  Internal Dependencies
import { NFT } from "./types/nft.types";
import { authorizationFunction } from "../flow-auth";
import { mintTx } from "../../cadence/transactions/apis";

@Injectable()
export class TransactionService {
  authrization = authorizationFunction(); // authentication

  //  Returns Test String
  test(): string {
    return "GraphQL: Transaction works";
  }

  //  Create the NFT on the blockchain and return the transactionID
  async mint(
    name: string,
    description: string,
    thumbnail: string
  ): Promise<string> {
    const transactionId = await fcl.mutate({
      cadence: mintTx,
      args: (arg, t) => [
        arg(String(name), t.String),
        arg(String(description), t.String),
        arg(String(thumbnail), t.String),
      ],
      proposer: this.authrization,
      payer: this.authrization,
      authorizations: [this.authrization],
      limit: 100,
    });

    await fcl.tx(transactionId).subscribe((res) => {
      console.log(res);
    });
    return transactionId;
  }

  //  Get NFT datas from given account on the Blockchain
  findMany(address: string): NFT[] {
    //  TODO: Find  NFT datas from Blockchain

    return [
      {
        id: 0,
        name: "name1",
        description: "desc1",
        thumbnail: "thumb1",
        file: {
          url: "fake1",
        },
        owner: "owner1",
      },
      {
        id: 1,
        name: "name2",
        description: "desc2",
        thumbnail: "thumb2",
        file: {
          url: "fake2",
        },
        owner: "owner2",
      },
      {
        id: 2,
        name: "name3",
        description: "desc3",
        thumbnail: "thumb3",
        file: {
          url: "fake3",
        },
        owner: "owner3",
      },
    ];
  }

  //  Get NFT data from give account with given id on the Blockchain
  findOne(id: number, address: string): NFT {
    //  TODO: Find NFT Data

    return {
      id: 0,
      name: "name1",
      description: "desc1",
      thumbnail: "thumb1",
      file: {
        url: "fake1",
      },
      owner: "owner1",
    };
  }

  //  Erase the NFT data from Blockchain
  burn(id: number): string {
    //  TODO: Find the NFT data
    //  TODO: Delete it from blockchain
    return "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690";
  }

  //  Trnasfer NFT with id to receiver address
  transfer(id: number, receiver: string): string {
    //  TODO: Get NFT data and change owner

    return "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690";
  }
}
