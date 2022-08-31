import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";
import { BadRequestException } from "@nestjs/common";
import { Data } from "./data.interface";

const setData = (fakedata) => {

};

const mockData = (id, name, description, thumbnail): Data => ({
  id,
  name,
  description,
  thumbnail,
});

const getMetaData = () => {
  return;
};

describe("TransactionService", () => {
  // eslint-disable-next-line prettier/prettier
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();
    service = module.get<TransactionService>(TransactionService);

    const fakeData = [
      {
        id: 0,
        name: "name1",
        description: "desc1",
        thumbnail: "thumb1",
      },
      {
        id: 1,
        name: "name2",
        description: "desc2",
        thumbnail: "thumb2",
      },
      {
        id: 2,
        name: "name3",
        description: "desc3",
        thumbnail: "thumb3",
      },
    ];
    setData(fakeData);

    // addData
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("mint", () => {
    // eslint-disable-next-line prettier/prettier
    it('should create an ExampleNFT on the blockchain ', () => {
      // expect(
      //   service.mint(
      //     'A sample name.',
      //     'A sample description.',
      //     'A sample thumbnail.',
      //   )
      // ).toEqual(
      //   'e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690'
      // );
      expect(() => {
        const result = service.mint(
          "A sample name.",
          "A sample description.",
          "A sample thumbnail."
        );
        const regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(result)).toBe(true);
      });
    });
  });

  describe("findMany", () => {
    it("should take an address as input and return all the NFTs owned by the address", () => {
      expect(service.findMany("0x01cf0e2f2f715450")).toEqual([
        {
          id: 0,
          name: "name1",
          description: "desc1",
          thumbnail: "thumb1",
        },
        {
          id: 1,
          name: "name2",
          description: "desc2",
          thumbnail: "thumb2",
        },
      ]);
    });
  });

  describe("findOne", () => {
    it("should take an address and NFT ID as input", () => {
      expect(service.findOne(0, "0x01cf0e2f2f715450")).toEqual({
        data: {
          name: "name1",
          description: "desc1",
          thumbnail: "thumb1",
        },
      });
    });
  });

  describe("burn", () => {
    it("should take an NFT ID as input and delete the ExampleNFT with the corresponding ID from our development account", () => {
      expect(() => {
        const result = service.burn(0);
        const regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(result)).toBe(true);
        const fakeData1 = [
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
        const metaData = getMetaData();
        expect(metaData).toEqual(fakeData1);
      });
    });
  });

  describe("transfer", () => {
    it("should transfer a specific ExampleNFT from our development account to the specified address", () => {
      expect(() => {
        const result = service.transfer(0, "0x01cf0e2f2f715450");
        const regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(result)).toBe(true);
      });
    });
  });
});
