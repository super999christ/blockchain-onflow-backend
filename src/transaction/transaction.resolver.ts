//  External Dependencies
import { BadRequestException, HttpException } from "@nestjs/common";
import { Query, Resolver, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { throwHttpGraphQLError } from "apollo-server-core/dist/runHttpQuery";
import FormatError from "easygraphql-format-error";

//  Internal Dependencies
import { TransactionService } from "./transaction.service";
import { NFT } from "./types/nft.types";

@Resolver("Transaction")
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query()
  test(): string {
    return this.transactionService.test();
  }

  /*
  Pattern: 
    mint(name: "Sample Name", description: "Sample description", thumbnail: "Sample thumbnail")
  */
  @Mutation((returns) => String)
  async mint(
    @Args("name", { type: () => String }) name: string,
    @Args("description", { type: () => String }) description: string,
    @Args("thumbnail", { type: () => String }) thumbnail: string
  ): Promise<string> {
    return await this.transactionService.mint(name, description, thumbnail);
  }

  /*
  Pattern: 
    findMany(address: "0x01cf0e2f2f715450", limit: 5, offset: 2) {
          name, description, file {url}
        }
  */
  @Query((returns) => [NFT])
  async findMany(
    @Args("address", { type: () => String }) address: string,
    @Args("limit", { type: () => Int }) limit: number,
    @Args("offset", { type: () => Int }) offset: number
  ): Promise<NFT[]> {
    return await this.transactionService.findMany(address, limit, offset);
  }

  /*
  Pattern: 
    findOne(id: 2, address: "0x01cf0e2f2f715450") {
            name, description, file {url}
          }
  */
  @Query((returns) => NFT)
  async findOne(
    @Args("id", { type: () => ID }) id: number,
    @Args("address", { type: () => String }) address: string
  ): Promise<NFT> {
    const formatError = new FormatError();
    if (id === undefined) throw Error(formatError.BAD_REQUEST);
    try {
      return await this.transactionService.findOne(id, address);
    } catch (e) {
      console.log(e);
      throw Error(formatError.NOT_FOUND);
    }
  }

  /*
  Pattern: 
    burn(id: 1)
  */
  @Mutation((returns) => String)
  burn(@Args("id", { type: () => ID }) id: number): Promise<string> {
    return this.transactionService.burn(id);
  }

  /*
  Pattern: 
    transfer(id: 1, receiver: "0x01cf0e2f2f715450")
  */
  @Mutation((returns) => String)
  transfer(
    @Args("id", { type: () => ID }) id: number,
    @Args("receiver", { type: () => String }) receiver: string
  ): Promise<string> {
    return this.transactionService.transfer(id, receiver);
  }
}
