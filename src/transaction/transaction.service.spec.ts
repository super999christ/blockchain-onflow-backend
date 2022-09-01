import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";

import "../flow-config";

describe("TransactionService", () => {
  // eslint-disable-next-line prettier/prettier
  let service: TransactionService;
  let addedID;
  let transferData;

  const fakeData = [
    { name: "fake1", description: "fake1", thumbnail: "fake1" },
    { name: "fake2", description: "fake2", thumbnail: "fake2" },
    { name: "fake3", description: "fake3", thumbnail: "fake3" },
    { name: "fake4", description: "fake4", thumbnail: "fake4" },
  ];

  const compareData = (source, nft) => {
    if (
      source.name === nft.name &&
      source.description === nft.description &&
      source.thumbnail === nft.thumbnail
    )
      return true;
    return false;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();
    service = module.get<TransactionService>(TransactionService);

    const nftData = await service.findMany("0x01cf0e2f2f715450", 10000, 0);
    console.log(nftData);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("mint", () => {
    // eslint-disable-next-line prettier/prettier
    it("should create an NFT on the blockchain ", async () => {
      const result = await service.mint("Test-Mint", "Test-Mint", "Test-Mint");

      const nftDatas = await service.findMany("0x01cf0e2f2f715450", 10000, 0);
      const createdNFT = nftDatas.find((nft) => {
        if (
          nft.name === "Test-Mint" &&
          nft.description === "Test-Mint" &&
          nft.thumbnail === "Test-Mint"
        )
          return nft;
      });
      expect(createdNFT).not.toBe(undefined);
      addedID = createdNFT.id;

      const regPattern = /[0-9a-f]{64}/g;
      expect(regPattern.test(result)).toBe(true);
    });
  });

  describe("findOne", () => {
    it("should return an NFT with specified ID", async () => {
      const result = await service.findOne(addedID, "0x01cf0e2f2f715450");
      expect(
        result.name === "Test-Mint" &&
          result.description === "Test-Mint" &&
          result.thumbnail === "Test-Mint"
      ).toBe(true);
    });
  });

  describe("burn", () => {
    it("should delete the NFT from blockchain", async () => {
      const result = await service.burn(addedID);

      const regPattern = /[0-9a-f]{64}/g;
      expect(regPattern.test(result)).toBe(true);

      const nftDatas = await service.findMany("0x01cf0e2f2f715450", 10000, 0);
      const createdNFT = nftDatas.find((nft) => {
        if (nft.id === addedID) return nft;
      });
      expect(createdNFT).toBe(undefined);
    });
  });

  describe("findMany", () => {
    it("should return all the created data", async () => {
      let i;
      for (i = 0; i < 4; i++) {
        const tId = await service.mint(
          fakeData[i].name,
          fakeData[i].description,
          fakeData[i].thumbnail
        );
        const regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(tId)).toBe(true);
      }

      const nftData = await service.findMany("0x01cf0e2f2f715450", 10000, 0);
      nftData.sort((nftA, nftB) => {
        if (nftA.id < nftB.id) return -1;
        else if (nftA.id > nftB.id) return 1;
        else return 0;
      });
      const addedData = nftData.slice(-4);
      expect(addedData.length).toBe(4);
      transferData = addedData[i];
      for (let i = 0; i < 4; i++) {
        expect(compareData(fakeData[i], addedData[i])).toBe(true);
      }
    });
  });

  // describe("transfer", () => {
  //   it("should check whether it is transfered", async () => {
  //     // const txID = await service.transfer(
  //     //   transferData.id,
  //     //   "0xf8d6e0586b0a20c7"
  //     // );
  //     // const regPattern = /[0-9a-f]{64}/g;
  //     // expect(regPattern.test(txID)).toBe(true);

  //     // let nftData = await service.findMany("0x01cf0e2f2f715450", 10000, 0);
  //     // nftData.sort((nftA, nftB) => {
  //     //   if (nftA.id < nftB.id) return -1;
  //     //   else if (nftA.id > nftB.id) return 1;
  //     //   else return 0;
  //     // });
  //     // const resultA = nftData.find((item) => {
  //     //   if (item.id === transferData.id) return item;
  //     // });
  //     // expect(resultA).toBe(undefined);

  //     // nftData = await service.findMany("0xf8d6e0586b0a20c7", 10000, 0);
  //     // nftData.sort((nftA, nftB) => {
  //     //   if (nftA.id > nftB.id) return -1;
  //     //   else if (nftA.id < nftB.id) return 1;
  //     //   else return 0;
  //     // });
  //     // const transferedData = nftData[0];
  //     // expect(compareData(transferData, transferedData)).toBe(true);
  //   });
  // });
});
