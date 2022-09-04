import { Test, TestingModule } from "@nestjs/testing";

import { TransactionService } from "./transaction.service";
import "../flow-config";
import setupTestAccount from "../setup-test-account";
import { devAccount, emulatorAccount } from "../flow-accounts";

describe("TransactionService", () => {
  let service: TransactionService;
  let addedID;
  let transferData;
  let addedToken = [];

  const fakeData = [
    { name: "fake1", description: "fake1", thumbnail: "fake1" },
    { name: "fake2", description: "fake2", thumbnail: "fake2" },
    { name: "fake3", description: "fake3", thumbnail: "fake3" },
    { name: "fake4", description: "fake4", thumbnail: "fake4" },
  ];

  const mockToken = {
    name: "MockName",
    description: "MockDescription",
    thumbnail: "MockThumbnail",
  };

  const compareData = (source, nft) => {
    if (
      source.name === nft.name &&
      source.description === nft.description &&
      source.thumbnail === nft.thumbnail
    )
      return true;
    return false;
  };

  const sortFunc = (nftA, nftB) => {
    if (nftA.id < nftB.id) return -1;
    else if (nftA.id > nftB.id) return 1;
    else return 0;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();
    service = module.get<TransactionService>(TransactionService);

    await setupTestAccount("emulator-account");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("mint", () => {
    it("should create an NFT on the blockchain ", async () => {
      const result = await service.mint(
        mockToken.name,
        mockToken.description,
        mockToken.thumbnail
      );

      const nftDatas = await service.findMany(devAccount, 10000, 0);
      const createdNFT = nftDatas.find((nft) => {
        if (compareData(nft, mockToken)) return nft;
      });
      expect(createdNFT).not.toBe(undefined);
      addedID = createdNFT.id;

      const regPattern = /[0-9a-f]{64}/g;
      expect(regPattern.test(result)).toBe(true);
    });
  });

  describe("findOne", () => {
    it("should return an NFT with specified ID", async () => {
      const result = await service.findOne(addedID, devAccount);
      expect(compareData(result, mockToken)).toBe(true);
    });
  });

  describe("burn", () => {
    it("should delete the NFT from blockchain", async () => {
      // before burn
      const prevNftDatas = await service.findMany(devAccount, 10000, 0);
      const prevNft = prevNftDatas.find((nft) => nft.id === addedID);
      expect(prevNft).not.toBe(undefined);

      // after burn
      const result = await service.burn(addedID);
      const regPattern = /[0-9a-f]{64}/g;
      expect(regPattern.test(result)).toBe(true);

      const nftDatas = await service.findMany(devAccount, 10000, 0);
      const burntNft = nftDatas.find((nft) => nft.id === addedID);
      expect(burntNft).toBe(undefined);
    });
  });

  describe("findMany", () => {
    it("should return all the created data", async () => {
      for (let i = 0; i < 4; i++) {
        const tId = await service.mint(
          fakeData[i].name,
          fakeData[i].description,
          fakeData[i].thumbnail
        );
        const regPattern = /[0-9a-f]{64}/g;
        expect(regPattern.test(tId)).toBe(true);
      }

      const nftData = await service.findMany(devAccount, 10000, 0);
      nftData.sort(sortFunc);
      const addedData = nftData.slice(-4);
      expect(addedData.length).toBe(4);
      transferData = addedData[0];
      addedToken = addedData;

      for (let i = 0; i < 4; i++) {
        expect(compareData(fakeData[i], addedData[i])).toBe(true);
      }
    });
  });

  describe("transfer", () => {
    it("should check whether it is transfered", async () => {
      const txID = await service.transfer(transferData.id, emulatorAccount);
      const regPattern = /[0-9a-f]{64}/g;
      expect(regPattern.test(txID)).toBe(true);
      let nftData = await service.findMany(devAccount, 10000, 0);
      nftData.sort(sortFunc);
      const resultA = nftData.find((item) => {
        if (item.id === transferData.id) return item;
      });
      expect(resultA).toBe(undefined);
      nftData = await service.findMany(emulatorAccount, 10000, 0);

      const transferedData = nftData.find((nft) => nft.id === transferData.id);
      expect(compareData(transferData, transferedData)).toBe(true);

      for (let i = 0; i < addedToken.length; i++) {
        await service.burn(addedToken[i].id);
      }
    });
  });
});
