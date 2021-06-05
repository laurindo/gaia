import { useState, useEffect } from 'react';
import { fcl } from '~/config/config';
import { getFlowBalance } from '~/flow/getFlowBalance';
import { getFUSDBalance } from '~/flow/getFusdBalance';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fcl.currentUser().subscribe(async u => {
      if (u?.addr) {
        let flowBalance = await getFlowBalance(u?.addr);
        let fusdBalance = await getFUSDBalance(u?.addr);
        u.balance = flowBalance;
        u.usd_balance = fusdBalance;
        setUser(u);
      } else {
        setUser(null);
      }
    });
  }, []);

  return {
    user,
    login: fcl.logIn,
    logout: fcl.unauthenticate,
    signup: fcl.signUp
  };
}
