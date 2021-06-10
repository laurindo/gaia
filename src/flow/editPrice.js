import { Spin, notification } from 'antd';
import { fcl, t } from '../config/config';

const EDIT_PRICE_TX = fcl.cdc`
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNFTInterface
import Gaia from 0xNFTContract
import FUSD from 0xFUSDContract
import GaiaMarket from 0xNFTMarket

transaction(address: Address, saleAssetID: UInt64, newPrice: UFix64) {
  let marketCollection: &GaiaMarket.Collection{GaiaMarket.CollectionPublic}
  prepare(signer: AuthAccount) {
    
    self.marketCollection = getAccount(address)
      .getCapability<&GaiaMarket.Collection{GaiaMarket.CollectionPublic}>(GaiaMarket.CollectionPublicPath).borrow()
      ?? panic("Could not borrow capability from public collection")

      let saleItem = self.marketCollection.borrowSaleItem(itemID: saleAssetID)
                  ?? panic("No item with that ID")

      saleItem.setPrice(newPrice)
     
  }
}
`;

export async function editPrice(address, saleAssetID, newPrice) {
  if (Number.isNaN(newPrice) || Number.isNaN(saleAssetID) || !address)
    throw new Error('Make sure all data you entered is correct');
  const correctSalePrice = newPrice.toFixed(8);
  try {
    const txId = await fcl
      .send([
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(100),
        fcl.args([
          fcl.arg(address, t.Address),
          fcl.arg(saleAssetID, t.UInt64),
          fcl.arg(correctSalePrice, t.UFix64)
        ]),
        fcl.transaction(EDIT_PRICE_TX)
      ])
      .then(fcl.decode);
    notification.open({
      key: `edit_sale_${saleAssetID}`,
      icon: <Spin />,
      message: `Editing #${saleAssetID} offer`,
      description: 'Sending transaction to the blockchain',
      duration: null
    });
    return fcl.tx(txId).onceSealed();
  } catch (err) {
    console.warn(err);
    throw new Error('changePrice(address, saleAssetID, newPrice)');
  }
}
