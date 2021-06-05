import { fcl, t } from '../config/config';

const LIST_NFTS_SCRIPT = fcl.cdc`
import NonFungibleToken from 0xNFTInterface
import FlowAssets from 0xNFTContract

// Print the NFTs owned by account.
// pub fun main(address: Address): [UInt64] {
pub fun main(address: Address): [&FlowAssets.NFT] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(FlowAssets.CollectionPublicPath)
                            .borrow<&{FlowAssets.FlowAssetsCollectionPublic}>()!

    let ids = collectionRef.getIDs()
    let assets: [&FlowAssets.NFT] = []

    for assetID in ids {
        let asset = collectionRef.borrowFlowAsset(id: assetID)!
        assets.append(asset)
    }

    return assets
}
`;

export async function listNfts(address) {
  if (address == null) throw new Error('listNfts(address) -- address required');
  return fcl
    .send([fcl.script(LIST_NFTS_SCRIPT), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);
}
