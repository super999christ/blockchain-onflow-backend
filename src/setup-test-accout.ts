import * as fcl from '@onflow/fcl';
import { authorizationFunction } from './flow-auth';
import Flow from '../flow.json';

const setTestAccount = async () => {
  const auth = authorizationFunction(
    Flow.accounts['emulator-account'].address,
    Flow.accounts['emulator-account'].key,
  );
  await fcl.mutate({
    cadence: `
      import ExampleNFT from 0xExampleNFT
      import NonFungibleToken from 0xTokens

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

setTestAccount();
