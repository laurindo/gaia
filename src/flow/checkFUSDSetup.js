import { fcl, t } from '../config/config';

const CHECK_FUSD_SETUP_TX = fcl.cdc`
import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSDContract

pub fun main(address: Address): Bool {
    let account = getAccount(address)
  
    let vaultRef = account
      .getCapability(/public/fusdBalance)!
      .borrow<&FUSD.Vault{FungibleToken.Balance}>()
      
    if (vaultRef != nil) {
        return true
    }
    return false
  }
`;

export async function checkFUSDSetup(address) {
  const txId = await fcl
    .send([fcl.script(CHECK_FUSD_SETUP_TX), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);

  return txId;
}
