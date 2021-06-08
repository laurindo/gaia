import { fcl, t } from '../config/config';

const BUY_NFT_TX = fcl.cdc`
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNFTInterface
import Gaia from 0xNFTContract
import FUSD from 0xFUSDContract
import GaiaMarket from 0xNFTMarket

transaction(saleAssetID: UInt64, address: Address) {
    let paymentVault: @FungibleToken.Vault
    let AssetsCollection: &Gaia.Collection{NonFungibleToken.Receiver}
    let marketCollection: &GaiaMarket.Collection{GaiaMarket.CollectionPublic}

    prepare(signer: AuthAccount) {
        let FUSDVaultStoragePath = /storage/fusdVault

        self.marketCollection = getAccount(address)
                    .getCapability<&GaiaMarket.Collection{GaiaMarket.CollectionPublic}>(GaiaMarket.CollectionPublicPath).borrow()
                    ?? panic("Could not borrow capability from public collection")

        let saleItem = self.marketCollection.borrowSaleItem(itemID: saleAssetID)
                    ?? panic("No item with that ID")
        let price = saleItem.price

        let mainFUSDVault = signer.borrow<&FUSD.Vault>(from: FUSDVaultStoragePath)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFUSDVault.withdraw(amount: price)

        self.AssetsCollection = signer.borrow<&Gaia.Collection{NonFungibleToken.Receiver}>(
            from: Gaia.CollectionStoragePath
        ) ?? panic("Cannot borrow Assets collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            itemID: saleAssetID,
            buyerCollection: self.AssetsCollection,
            buyerPayment: <- self.paymentVault
        )
    }
}
`;

export async function buy(saleAssetID, address) {
  const txId = await fcl
    .send([
      fcl.transaction(BUY_NFT_TX),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.args([fcl.arg(saleAssetID, t.UInt64), fcl.arg(address, t.Address)]),
      fcl.limit(1000)
    ])
    .then(fcl.decode);
  return fcl.tx(txId).onceSealed();
}
