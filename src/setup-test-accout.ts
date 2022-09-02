import * as fcl from "@onflow/fcl";
import { authorizationFunction } from "./flow-auth";
import Flow from "../flow.json";

const setTestAccount = async (account: string) => {
  const auth = authorizationFunction(
    Flow.accounts[account].address,
    Flow.accounts[account].key
  );
  const transactionId = await fcl.mutate({
    cadence: `
      import ExampleNFT from 0x01cf0e2f2f715450
      import NonFungibleToken from 0xf8d6e0586b0a20c7

      transaction {
        prepare(acct: AuthAccount) {
          let collection <- ExampleNFT.createEmptyCollection()

          acct.save<@ExampleNFT.Collection>(<- collection, to: ExampleNFT.CollectionStoragePath)

          acct.link<&{NonFungibleToken.CollectionPublic}>(
            ExampleNFT.CollectionPublicPath, 
            target: ExampleNFT.CollectionStoragePath
          )
        }
      }
    `,
    proposer: auth,
    payer: auth,
    authorizations: [auth],
    limit: 100,
  });
};

export default setTestAccount;
