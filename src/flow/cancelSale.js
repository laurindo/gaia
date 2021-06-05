import { Spin, notification } from 'antd';

import { fcl, t } from '../config/config';

const CANCEL_SALE_TX = fcl.cdc`
import FlowAssetsMarket from 0xNFTMarket

transaction(saleAssetID: UInt64) {
    let marketCollection: &FlowAssetsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&FlowAssetsMarket.Collection>(from: FlowAssetsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed FlowAssetsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(itemID: saleAssetID)
        destroy offer
    }
}
`;

export async function cancelSale(saleAssetID) {
  try {
    const txId = await fcl
      .send([
        fcl.transaction(CANCEL_SALE_TX),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.args([fcl.arg(Number(saleAssetID), t.UInt64)]),
        fcl.limit(100)
      ])
      .then(fcl.decode);
    notification.open({
      key: `cancel_sale_${saleAssetID}`,
      icon: <Spin />,
      message: `Canceling #${saleAssetID} offer`,
      description: 'Sending transaction to the blockchain',
      duration: null
    });
    return fcl.tx(txId).onceSealed();
  } catch (err) {
    console.warn(err);
    throw new Error(
      'createSaleOffer(saleAssetID, salePrice, marketFee, templateID, marketPaymentReceiver) -- templateID required'
    );
  }
}
