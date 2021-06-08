import { fcl, t } from '../config/config';

const LIST_NFTS_SCRIPT = fcl.cdc`
  import Gaia from 0xNFTContract
  import GaiaMarket from 0xNFTMarket

  pub struct AssetVO {
    pub let id: UInt64
    pub let price: UFix64
    pub let templateID: UInt64
  
    init(id: UInt64, price: UFix64, templateID: UInt64) {
      self.id = id
      self.price = price
      self.templateID = templateID
    }
  }

  pub fun main(address: Address): [AssetVO] {
        
    let colectionRef = getAccount(address)
        .getCapability<&GaiaMarket.Collection{GaiaMarket.CollectionPublic}>(GaiaMarket.CollectionPublicPath).borrow()
        ?? panic("Could not borrow capability from public collection")
      if(colectionRef != nil){
        let ids = colectionRef.getSaleOfferIDs()
        let assets: [AssetVO] = []
        
        for assetID in ids {
          let sale = colectionRef.borrowSaleItem(itemID: assetID)!
          let a = AssetVO(id: sale.itemID, price: sale.price, templateID: sale.templateID)
          assets.append(a)
        }
        return assets
      }
      return []
    
    
  }
`;
export async function getSales(address) {
  try {
    const r = await fcl
      .send([fcl.script(LIST_NFTS_SCRIPT), fcl.args([fcl.arg(address, t.Address)])])
      .then(fcl.decode);
    return r;
  } catch (error) {
    console.warn(error);
    return [];
  }
}
