import { notification, Spin } from 'antd';
import { fcl } from '../config/config';

const TX = fcl.cdc`
import Profile from 0xProfile
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNFTInterface
import FlowToken from 0xFlowToken
import Gaia from 0xNFTContract
import GaiaMarket from 0xNFTMarket
import FUSD from 0xFUSDContract

// This transaction configures an account to hold assets.
transaction {

    let address: Address

    prepare(account: AuthAccount) {
      let FlowTokenReceiverPublicPath = /public/flowTokenReceiver
      let FlowTokenVaultStoragePath = /storage/flowTokenVault
      //INITIALIZING PARAMS
      self.address = account.address
        
        // Init Profile
        if (!Profile.check(self.address)) {
          // This creates and stores the Profile in the users account
          account.save(<- Profile.new(), to: Profile.privatePath)

          // This creates the public capability that lets applications read the profiles info
          account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
        }

        // First, check to see if a moment collection already exists
        if account.borrow<&Gaia.Collection>(from: Gaia.CollectionStoragePath) == nil {
            // create a new Gaia Collection
            let collection <- Gaia.createEmptyCollection() as! @Gaia.Collection
            // Put the new Collection in storage
            account.save(<-collection, to: Gaia.CollectionStoragePath)
            // create a public capability for the collection
            account.link<&{Gaia.CollectionPublic}>(Gaia.CollectionPublicPath, target: Gaia.CollectionStoragePath)
        }

        // Init Gaia Market collection
        if account.borrow<&GaiaMarket.Collection>(from: GaiaMarket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- GaiaMarket.createEmptyCollection() as! @GaiaMarket.Collection
            
            // save it to the account
            account.save(<-collection, to: GaiaMarket.CollectionStoragePath)

            // create a public capability for market the collection
            account.link<&GaiaMarket.Collection{GaiaMarket.CollectionPublic}>(GaiaMarket.CollectionPublicPath, target: GaiaMarket.CollectionStoragePath)
        
            // create a public capability for the collection
            if !account.getCapability<&Gaia.Collection{NonFungibleToken.Provider}>(/private/GaiaCollectionProvider)!.check() {
              account.link<&Gaia.Collection{NonFungibleToken.Provider}>(/private/GaiaCollectionProvider, target: Gaia.CollectionStoragePath)
            }
  
          }

        //Init FUSD Balance
        if account.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
          
          // Create a new FUSD Vault and put it in storage
          account.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
      
          // Create a public capability to the Vault that only exposes
          // the deposit function through the Receiver interface
          account.link<&FUSD.Vault{FungibleToken.Receiver}>(
            /public/fusdReceiver,
            target: /storage/fusdVault
          )
      
          // Create a public capability to the Vault that only exposes
          // the balance field through the Balance interface
          account.link<&FUSD.Vault{FungibleToken.Balance}>(
            /public/fusdBalance,
            target: /storage/fusdVault
          )
         
      }
      //Init Flow Token Balance
      if account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
        // Create a new flowToken Vault and put it in storage
        account.save(<-FlowToken.createEmptyVault(), to: /storage/flowTokenVault)

        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        account.link<&FlowToken.Vault{FungibleToken.Receiver}>(
            /public/flowTokenReceiver,
            target: /storage/flowTokenVault
        )

        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        account.link<&FlowToken.Vault{FungibleToken.Balance}>(
            /public/flowTokenBalance,
            target: /storage/flowTokenVault
        )
    }
  }
}
`;

export async function setupAccount() {
  try {
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
      key: `setup_account`,
      icon: <Spin />,
      message: `Setting up your account`,
      description: 'Sending transaction to the blockchain',
      duration: null
    });
    return fcl.tx(txId).onceSealed();
  } catch (err) {
    console.warn(err);
    throw new Error(err);
  }
}
