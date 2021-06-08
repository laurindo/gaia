import { Spin, notification } from 'antd';
import { fcl, t } from '../config/config';

const TRANSFER_NFT_TX = fcl.cdc`
import NonFungibleToken from 0xNFTInterface
import Gaia from 0xNFTContract

// This transaction transfers a Kitty Item from one account to another.
transaction(recipient: Address, withdrawID: UInt64) {
    prepare(signer: AuthAccount) {
        
        // get the recipients public account object
        let recipienter = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer.borrow<&Gaia.Collection>(from: Gaia.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        //let depositRef = recipienter.getCapability(Gaia.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!
        let depositRef = recipienter.getCapability(Gaia.CollectionPublicPath)
              .borrow<&{Gaia.CollectionPublic}>()!  

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}
`;

export async function transferNft(recipient, withdrawID) {
  try {
    const txId = await fcl
      .send([
        fcl.transaction(TRANSFER_NFT_TX),
        fcl.args([fcl.arg(recipient, t.Address), fcl.arg(withdrawID, t.UInt64)]),
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(35) // set the compute limit
      ])
      .then(fcl.decode);
    notification.open({
      key: `transfer_${withdrawID}`,
      icon: <Spin />,
      message: `Transferring #${withdrawID} to ${recipient}`,
      description: 'Sending transaction to the blockchain',
      duration: null
    });
    return fcl.tx(txId).onceSealed();
  } catch (err) {
    throw new Error(err);
  }
}
