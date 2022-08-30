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
  mint(
    @Args('name', { type: () => String }) name: string,
    @Args('description', { type: () => String }) description: string,
    @Args('thumbnail', { type: () => String }) thumbnail: string,
  ): string {
    console.log(name, description, thumbnail);
    return this.transactionService.mint(name, description, thumbnail);
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
  findMany(@Args('address', { type: () => String }) address: string): NFT[] {
    console.log(address);
    return this.transactionService.findMany(address);
  }

  /*
  Pattern: 
    findOne(id: 0, address: "111111") {
        name, description, file {url}
    }
  */
  @Query((returns) => NFT)
  findOne(
    @Args('id', { type: () => ID }) id: number,
    @Args('address', { type: () => String }) address: string,
  ): NFT {
    console.log(id, address);
    return this.transactionService.findOne(id, address);
  }

  /*
  Pattern: 
    burn(id: 1)
  */
  @Mutation((returns) => String)
  burn(@Args('id', { type: () => ID }) id: number): string {
    console.log(id);
    return this.transactionService.burn(id);
  }

  /*
  Pattern: 
    transfer(id: 1, receiver: "0x01cf0e2f2f715450")
  */
  @Mutation((returns) => String)
  transfer(
    @Args('id', { type: () => ID }) id: number,
    @Args('receiver', { type: () => String }) receiver: string,
  ) {
    console.log(id, receiver);
    return this.transactionService.transfer(id, receiver);
  }
}
