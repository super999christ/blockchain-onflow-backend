import { Test, TestingModule } from "@nestjs/testing";
import { TransactionResolver } from "./transaction.resolver";
import { TransactionService } from "./transaction.service";

describe("TransactionResolver", () => {
  let resolver: TransactionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useFactory: () => ({
            mint: jest.fn(
              (name: string, description: string, thumbnail: string) =>
                "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
            ),

            findMany: jest.fn(
              (address: string, limit: number, offset: number) => [
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
              ]
            ),
            findOne: jest.fn((id: number, address: string) => ({
              id: 0,
              name: "name1",
              description: "desc1",
              thumbnail: "thumb1",
              file: {
                url: "fake1",
              },
              owner: "owner1",
            })),
            burn: jest.fn(
              (id: number) =>
                "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
            ),
            transfer: jest.fn(
              (id: number, receiver: string) =>
                "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
            ),
          }),
        },
      ],
    }).compile();
    resolver = module.get<TransactionResolver>(TransactionResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("mint", () => {
    // eslint-disable-next-line prettier/prettier
    // resolver, service
    it("should create an ExampleNFT on the blockchain ", async () => {
      expect(
        await resolver.mint(
          "A sample name.",
          "A sample description.",
          "A sample thumbnail."
        )
      ).toEqual(
        "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
      );
    });
  });

  describe("findMany", () => {
    it("should take an address as input and return all the NFTs owned by the address", async () => {
      expect(await resolver.findMany("0x01cf0e2f2f715450", 5, 0)).toEqual([
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
      ]);
    });
  });

  describe("findOne", () => {
    it("should take an address and NFT ID as input", async () => {
      expect(await resolver.findOne(0, "0x01cf0e2f2f715450")).toEqual({
        id: 0,
        name: "name1",
        description: "desc1",
        thumbnail: "thumb1",
        file: {
          url: "fake1",
        },
        owner: "owner1",
      });
    });
  });

  describe("burn", () => {
    it("should take an NFT ID as input and delete the ExampleNFT with the corresponding ID from our development account", async () => {
      expect(await resolver.burn(0)).toEqual(
        "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
      );
    });
  });

  describe("transfer", () => {
    it("should transfer a specific ExampleNFT from our development account to the specified address", async () => {
      expect(
        await resolver.transfer(
          // The ID of the NFT to transfer
          0,
          // The address of the account that will receive the NFT
          "0x01cf0e2f2f715450"
        )
      ).toEqual(
        "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
      );
    });
  });
});
