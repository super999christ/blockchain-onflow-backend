//  External Dependencies
import { Query, Resolver, Mutation, Args, ID } from '@nestjs/graphql';

//  Internal Dependencies
import { TransactionService } from './transaction.service';
import { NFT } from './types/nft.types';

@Resolver('Transaction')
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
    @Args('name', { type: () => String }) name: string,
    @Args('description', { type: () => String }) description: string,
    @Args('thumbnail', { type: () => String }) thumbnail: string,
  ): Promise<string> {
    console.log(name, description, thumbnail);
    return await this.transactionService.mint(name, description, thumbnail);
  }

  /*
  Pattern: 
    findMany(address: "111111") {
        name, 
        description, 
        file {
          url
        }
    }
  */
  @Query((returns) => [NFT])
  async findMany(
    @Args('address', { type: () => String }) address: string,
  ): Promise<NFT[]> {
    console.log(address);
    return await this.transactionService.findMany(address);
  }

  /*
  Pattern: 
    findOne(id: 0, address: "111111") {
        name, description, file {url}
    }
  */
  @Query((returns) => NFT)
  async findOne(
    @Args('id', { type: () => ID }) id: number,
    @Args('address', { type: () => String }) address: string,
  ): Promise<NFT> {
    console.log(id, address);
    return await this.transactionService.findOne(id, address);
  }

  /*
  Pattern: 
    burn(id: 1)
  */
  @Mutation((returns) => String)
  async burn(@Args('id', { type: () => ID }) id: number): Promise<string> {
    console.log(id);
    return await this.transactionService.burn(id);
  }

  /*
  Pattern: 
    transfer(id: 1, receiver: "0x01cf0e2f2f715450")
  */
  @Mutation((returns) => String)
  async transfer(
    @Args('id', { type: () => ID }) id: number,
    @Args('receiver', { type: () => String }) receiver: string,
  ): Promise<string> {
    console.log(id, receiver);
    return await this.transactionService.transfer(id, receiver);
  }
}
