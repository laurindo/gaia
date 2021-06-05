import { fcl, t } from '../config/config';

const FETCH_PROFILE_SCRIPT = fcl.cdc`
import Profile from 0xProfile

pub fun main(address: Address): Profile.ReadOnly? {
  return Profile.read(address)
}
`;

export async function getProfile(address) {
  if (address == null) return null;
  return fcl
    .send([fcl.script(FETCH_PROFILE_SCRIPT), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode);
}
