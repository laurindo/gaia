import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

const ipfsApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const ipfsPrivateKey = process.env.NEXT_PUBLIC_PINATA_PRIVATE_API_KEY;
const ipfsPostUrl = process.env.NEXT_PUBLIC_PINATA_POST_URL;
const ipfsGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
const marketAddress = process.env.NEXT_PUBLIC_NFTMARKET_CONTRACT;
const landingOnly = process.env.NEXT_PUBLIC_LANDING_ONLY === 'true';
const appName = process.env.NEXT_PUBLIC_APP_NAME;

fcl
  .config()
  .put('accessNode.api', process.env.NEXT_PUBLIC_ACCESS_NODE)
  .put('challenge.handshake', process.env.NEXT_PUBLIC_WALLET_DISCOVERY)
  .put('0xFungibleToken', process.env.NEXT_PUBLIC_FUNGIBLE_TOKEN)
  .put('0xFlowToken', process.env.NEXT_PUBLIC_FLOW_TOKEN)
  .put('0xFUSDContract', process.env.NEXT_PUBLIC_FUSD)
  .put('0xProfile', process.env.NEXT_PUBLIC_PROFILE_CONTRACT)
  .put('0xNFTInterface', process.env.NEXT_PUBLIC_NFT_INTERFACE)
  .put('0xNFTContract', process.env.NEXT_PUBLIC_NFT_CONTRACT)
  .put('0xNFTMarket', marketAddress);

export {
  fcl,
  t,
  ipfsApiKey,
  ipfsPrivateKey,
  ipfsPostUrl,
  ipfsGateway,
  marketAddress,
  landingOnly,
  appName
};
