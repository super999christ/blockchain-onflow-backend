//  External Dependencies
import { Injectable } from '@nestjs/common';

//  Internal Dependencies
import { NFT } from './types/nft.types';

@Injectable()
export class TransactionService {
  //  Returns Test String
  test(): string {
    return 'GraphQL: Transaction works';
  }

  //  Create the NFT on the blockchain and return the transactionID
  mint(name: string, description: string, thumbnail: string): string {
    //  TODO: Create the NFT Data

    //  TODO: Save the Created NFT on Blockchain

    return 'e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690';
  }

  //  Get NFT datas from given account on the Blockchain
  findMany(address: string): NFT[] {
    //  TODO: Find  NFT datas from Blockchain

    return [
      {
        id: 0,
        name: 'name1',
        description: 'desc1',
        thumbnail: 'thumb1',
        file: {
          url: 'fake1',
        },
        owner: 'owner1',
      },
      {
        id: 1,
        name: 'name2',
        description: 'desc2',
        thumbnail: 'thumb2',
        file: {
          url: 'fake2',
        },
        owner: 'owner2',
      },
      {
        id: 2,
        name: 'name3',
        description: 'desc3',
        thumbnail: 'thumb3',
        file: {
          url: 'fake3',
        },
        owner: 'owner3',
      },
    ];
  }

  //  Get NFT data from give account with given id on the Blockchain
  findOne(id: number, address: string): NFT {
    //  TODO: Find NFT Data

    return {
      id: 0,
      name: 'name1',
      description: 'desc1',
      thumbnail: 'thumb1',
      file: {
        url: 'fake1',
      },
      owner: 'owner1',
    };
  }

  //  Erase the NFT data from Blockchain
  burn(id: number): string {
    //  TODO: Find the NFT data
    //  TODO: Delete it from blockchain
    return 'e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690';
  }

  //  Trnasfer NFT with id to receiver address
  transfer(id: number, receiver: string): string {
    //  TODO: Get NFT data and change owner

    return 'e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690';
  }
}
