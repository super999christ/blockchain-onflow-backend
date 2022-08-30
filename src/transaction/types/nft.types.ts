import { ObjectType, Field, ID } from '@nestjs/graphql';

import { FileInfo } from './file.types';

@ObjectType()
export class NFT {
  @Field((type) => ID)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;

  @Field((type) => String)
  thumbnail: string;

  @Field((type) => FileInfo)
  file: FileInfo;

  @Field((type) => String)
  owner: string;
}
