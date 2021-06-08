/* eslint-disable no-console */
import { Spin, notification } from 'antd';

import { fcl, t } from '../config/config';

const SALE_NFT_TX = `
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNFTInterface
  import Gaia from 0xNFTContract
  import GaiaMarket from 0xNFTMarket
  import FUSD from 0xFUSDContract


  transaction(saleAssetID: UInt64, salePrice: UFix64, templateID: UInt64) {
    let FUSDVault: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let GaiaCollection: Capability<&Gaia.Collection{NonFungibleToken.Provider}>
    let marketCollection: &GaiaMarket.Collection
    let marketFee: UFix64

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let GaiaCollectionProviderPrivatePath = /private/GaiaCollectionProvider

        self.FUSDVault = signer.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!
        assert(self.FUSDVault.borrow() != nil, message: "Missing or mis-typed FUSD receiver")


        self.marketCollection = signer.borrow<&GaiaMarket.Collection>(from: GaiaMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed GaiaMarket Collection")

      self.GaiaCollection = signer.getCapability<&Gaia.Collection{NonFungibleToken.Provider}>(GaiaCollectionProviderPrivatePath)!
      assert(self.GaiaCollection.borrow() != nil, message: "Missing or mis-typed GaiaCollection provider")

    // borrow a reference to the signer's NFT collection
    let collectionRef = signer.borrow<&Gaia.Collection>(from: Gaia.CollectionStoragePath)
        ?? panic("Could not borrow a reference to the owner's collection")

    // get asset set id
    let asset = collectionRef.borrowGaiaAsset(id: saleAssetID)!
    let setiD = asset.data.setID

    // get market fee by set id
    self.marketFee = Gaia.getSetMarketFee(setID: setiD)!

    }
    execute {
      let offer <- GaiaMarket.createSaleOffer (
        sellerItemProvider: self.GaiaCollection,
        itemID: saleAssetID,
        templateID: templateID,
        sellerPaymentReceiver: self.FUSDVault,
        marketPaymentReceiver: self.FUSDVault,
        price: salePrice,
        marketFee: self.marketFee
    )
        self.marketCollection.insert(offer: <-offer)
    }
}
`;

export async function createSaleOffer(saleAssetID, salePrice, templateID) {
  if (saleAssetID == null)
    throw new Error(
      'createSaleOffer(saleAssetID, salePrice, marketFee, templateID, marketPaymentReceiver) -- saleAssetID required'
    );
  if (salePrice == null)
    throw new Error(
      'createSaleOffer(saleAssetID, salePrice, marketFee, templateID, marketPaymentReceiver) -- salePrice required'
    );
  if (templateID == null)
    throw new Error(
      'createSaleOffer(saleAssetID, salePrice, marketFee, templateID, marketPaymentReceiver) -- templateID required'
    );
  const correctSalePrice = Number(salePrice).toFixed(8);
  try {
    const txId = await fcl
      .send([
        fcl.transaction(SALE_NFT_TX),
        //salePrice must have 1. something , INT are not accepted by this transaction
        fcl.args([
          fcl.arg(Number(saleAssetID), t.UInt64),
          fcl.arg(Number(correctSalePrice).toFixed(8), t.UFix64),
          fcl.arg(Number(templateID), t.UInt64)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(1000)
      ])
      .then(async a => {
        let response = await fcl.decode(a);
        console.log(response);
        return response;
      });
    notification.open({
      key: `sale_${saleAssetID}`,
      icon: <Spin />,
      message: `Creating an FUSD offer for ID #${saleAssetID}`,
      description: 'Sending transaction to the blockchain',
      duration: null
    });
    return fcl.tx(txId).onceSealed();
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
