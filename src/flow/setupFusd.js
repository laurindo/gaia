import { notification, Spin } from 'antd';
import { fcl } from '../config/config';

const TX = fcl.cdc`
import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSDContract

transaction {
  prepare(signer: AuthAccount) {

    let existingVault = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)

    // If the account is already set up that's not a problem, but we don't want to replace it
    if (existingVault != nil) {
        return
    }
    
    // Create a new FUSD Vault and put it in storage
    signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

    // Create a public capability to the Vault that only exposes
    // the deposit function through the Receiver interface
    signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
      /public/fusdReceiver,
      target: /storage/fusdVault
    )

    // Create a public capability to the Vault that only exposes
    // the balance field through the Balance interface
    signer.link<&FUSD.Vault{FungibleToken.Balance}>(
      /public/fusdBalance,
      target: /storage/fusdVault
    )
  }
}
`;

export async function setupFUSD() {
  const txId = await fcl
    .send([
      fcl.transaction(TX),
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(100) // set the compute limit
    ])
    .then(fcl.decode);
  notification.open({
    key: `setup_fusd`,
    icon: <Spin />,
    message: `Setting up your FUSD balance`,
    description: 'Sending transaction to the blockchain',
    duration: null
  });
  return fcl.tx(txId).onceSealed();
}
