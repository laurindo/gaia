import { fcl, t } from '../config/config';

const TX = fcl.cdc`
import FungibleToken from 0xFungibleToken
import FUSD from 0xFUSDContract

pub fun main(address: Address): UFix64 {
  let account = getAccount(address)

  let vaultRef = account
    .getCapability(/public/fusdBalance)!
    .borrow<&FUSD.Vault{FungibleToken.Balance}>()
    ?? panic("Could not borrow Balance capability")

  return vaultRef.balance
}
`;

export async function getFUSDBalance(address) {
  try {
    let balance = await fcl
      .send([fcl.script(TX), fcl.args([fcl.arg(address, t.Address)])])
      .then(fcl.decode);
    return Number(balance).toFixed(2);
  } catch (err) {
    console.error(err);
    return Number(0);
  }
}
