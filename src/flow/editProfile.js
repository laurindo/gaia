import { fcl, t } from '../config/config';

const EDIT_PROFILE_TX = fcl.cdc`
import Profile from 0xProfile

transaction(name: String, avatar: String, info: String) {
  prepare(account: AuthAccount) {
    if (name.length > 0) {
      account
        .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
        .setName(name)
    }
    if (avatar.length > 0) {
      account
        .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
        .setAvatar(avatar)
    }
    if (info.length > 0) {
      account
        .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
        .setInfo(info)
    }
  }
}
`;

export async function editProfile(name, avatar, info) {
  const txId = await fcl
    .send([
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(50),
      fcl.args([
        fcl.arg(name ?? '', t.String),
        fcl.arg(avatar ?? '', t.String),
        fcl.arg(info ?? '', t.String)
      ]),
      fcl.transaction(EDIT_PROFILE_TX)
    ])
    .then(async a => {
      console.warn(a);
      return fcl.decode(a);
    });

  return txId;
}

export const getProfile = async address => {
  if (address == null) throw new Error('isInitialized(address) -- address required');
  return fcl
    .send([
      fcl.script`
          import Profile from 0xProfile
    
          pub fun main(address: Address): Profile.ReadOnly? {
            return Profile.read(address)
          }
        `,
      fcl.args([
        fcl.arg(address, t.Address) // <-- t.Address this time :)
      ])
    ])
    .then(fcl.decode);
};
