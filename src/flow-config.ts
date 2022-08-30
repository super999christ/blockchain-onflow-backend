import { config } from '@onflow/fcl';
import details from '../flow.json';

config({
  // "accessNode.api": details.networks.testnet,
  // 'flow.network': details.networks,
  // 'service.OpenID.scopes': details.accounts,

  'accessNode.api': 'http://localhost:8888',
  '0xTokens': '0xf8d6e0586b0a20c7',
  '0xExampleNFT': '0x01cf0e2f2f715450',
  'discovery.wallet': 'http://localhost:3569/fcl/authn',
});
