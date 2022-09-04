import * as fcl from "@onflow/fcl";
import { devAccount, emulatorAccount } from "./flow-accounts";

fcl
  .config()
  .put("accessNode.api", "http://localhost:8888")
  .put("0xTokens", emulatorAccount)
  .put("0xExampleNFT", devAccount)
  .put("discovery.wallet", "http://localhost:3569/fcl/authn");
