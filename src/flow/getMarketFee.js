import { fcl, t } from '../config/config';

const GET_MARKET_FEE = fcl.cdc`
import NonFungibleToken from 0xNFTInterface
import FlowAssets from 0xNFTContract

// Print the NFTs owned by account.
// pub fun main(address: Address): [UInt64] {
pub fun main(address: Address, assetID: UInt64 ): UFix64? {
    let account = getAccount(address)

    let collectionRef = account.getCapability(FlowAssets.CollectionPublicPath)
                            .borrow<&{FlowAssets.FlowAssetsCollectionPublic}>()!

    let asset = collectionRef.borrowFlowAsset(id: assetID)!
    let setiD = asset.data.setID
    let marketFee = FlowAssets.getSetMarketFee(setID: setiD)

    return marketFee
}
`;

export async function getMarketFee(address, assetID) {
  if (address == null) throw new Error('getMarketFee(address) -- address required');
  if (address == null) throw new Error('getMarketFee(assetID) -- assetID required');
  return fcl
    .send([
      fcl.script(GET_MARKET_FEE),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(assetID, t.UInt64)])
    ])
    .then(fcl.decode);
}
