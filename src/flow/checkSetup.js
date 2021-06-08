import { fcl, t } from '../config/config';

const CHECK_SETUP_TX = fcl.cdc`
import Gaia from 0xNFTContract

pub fun main(address: Address): Bool {
        
  return Gaia.checkSetup(address)
}
`;

export async function checkSetup(address) {
  const txId = await fcl
    .send([fcl.script(CHECK_SETUP_TX), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);

  return txId;
}
