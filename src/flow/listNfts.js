import { fcl, t } from '../config/config';

const LIST_NFTS_SCRIPT = fcl.cdc`
import NonFungibleToken from 0xNFTInterface
import Gaia from 0xNFTContract

// Print the NFTs owned by account.
// pub fun main(address: Address): [UInt64] {
pub fun main(address: Address): [&Gaia.NFT] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Gaia.CollectionPublicPath)
                            .borrow<&{Gaia.CollectionPublic}>()!

    let ids = collectionRef.getIDs()
    let assets: [&Gaia.NFT] = []

    for assetID in ids {
        let asset = collectionRef.borrowGaiaAsset(id: assetID)!
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
