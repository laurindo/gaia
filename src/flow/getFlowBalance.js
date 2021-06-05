import { fcl } from '../config/config';

export async function getFlowBalance(address) {
  if (address == null) return null;
  const account = await fcl.account(address);
  return Math.trunc(Number(account?.balance / 100000000));
}
