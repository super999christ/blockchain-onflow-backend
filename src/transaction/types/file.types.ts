import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FileInfo {
  @Field((type) => String)
  url: string;
}
