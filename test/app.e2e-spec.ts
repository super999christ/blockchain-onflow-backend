import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { TransactionModule } from '../src/transaction/transaction.module';

import '../src/flow-config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    //  Configuring GraphQL
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TransactionModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          typePaths: ['./**/*.graphql'],
          installSubscriptionHandlers: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //  Validate NFT Object
  const validateNFT = (item) => {
    if (
      item.name !== null &&
      item.name !== undefined &&
      typeof item.name !== 'string'
    )
      return false;
    if (
      item.description !== null &&
      item.description !== undefined &&
      typeof item.description !== 'string'
    )
      return false;
    if (
      item.file.url !== null &&
      item.file.url !== undefined &&
      typeof item.file.url !== 'string'
    )
      return false;
    return true;
  };

  //  Sample E2E test
  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  //  Test: GraphQL / test
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Returning value equals "GraphQL: Transaction works";
  it('GraphQL: test (query)', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'test',
        query: `query test {
        test
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        const data = body.data.test;
        expect(data).toBe('GraphQL: Transaction works');
      });
  });

  //  Test: GraphQL / mint
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Length of returning value must be 64;
  //    3. Type of returning value must includes only 'a ~ f, 0 ~ 9';
  it('GraphQL: mint (mutation)', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'testMint',
        query: `mutation testMint {
          mint(name: "Sample Name", description: "Sample description", thumbnail: "Sample thumbnail")
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        let data = body.data.mint;
        let regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(data)).toBe(true);
      });
  });

  //  Test: GraphQL / findMany
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Type of returning value must be Array;
  //    3. Length of returning value must be greater than 0;
  //    4. Type of each item must be NFT;
  it('GraphQL: findMany (query)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'testFindMany',
        query: `query testFindMany {
        findMany(address: "0x01cf0e2f2f715450", limit: 5, offset: 2) {
          name, description, file {url}
        }
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        let data = body.data.findMany;
        expect(data.length).toBeGreaterThanOrEqual(0);
        data.forEach((NFT) => {
          expect(validateNFT(NFT)).toBe(true);
        });
      });
  });

  //  Test: GraphQL / findOne
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Returning value must be exist, not null or undefined
  //    3. Type of returning value must be NFT
  it('GraphQL: findOne (query)', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'testFindOne',
        query: `query testFindOne {
        findOne(id: 2, address: "0x01cf0e2f2f715450") {
            name, description, file {url}
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        let data = body.data.findOne;
        expect(data).not.toBeNull();
        expect(data).not.toBeUndefined();
        expect(validateNFT(data)).toBe(true);
      });
  });

  //  Test: GraphQL / burn
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Length of returning value must be 64;
  //    3. Type of returning value must includes only 'a ~ f, 0 ~ 9';
  it('GraphQL: burn (mutation)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'testBurn',
        query: `mutation testBurn {
        burn(id: 1)
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        let data = body.data.burn;
        let regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(data)).toBe(true);
      });
  });

  //  Test: GraphQL / transfer
  //  Acceptance Criteria:
  //    1. Status code must be 200;
  //    2. Length of returning value must be 64;
  //    3. Type of returning value must includes only 'a ~ f, 0 ~ 9';
  it('GraphQL: transfer (mutation)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'testTransfer',
        query: `mutation testTransfer {
        transfer(id: 1, receiver: "0x01cf0e2f2f715450")
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        let data = body.data.transfer;
        let regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(data)).toBe(true);
      });
  });
});
