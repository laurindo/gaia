import { fcl, t } from '../config/config';

const PROFILE_INITIALIZED_SCRIPT = fcl.cdc`
import Profile from 0xProfile

pub fun main(address: Address): Bool {
  return Profile.check(address)
}
`;

export default async function isInitialized(address) {
  if (address == null) throw new Error('isInitialized(address) -- address required');

  return fcl
    .send([fcl.script(PROFILE_INITIALIZED_SCRIPT), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);
}
