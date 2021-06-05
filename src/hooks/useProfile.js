import { useState, useEffect } from 'react';
import { getProfile } from '~/flow/getProfile';
import { checkSetup } from '~/flow/checkSetup';

import isInitialized from '~/flow/isInitialized';
import { checkFUSDSetup } from '~/flow/checkFUSDSetup';

export default function useProfile(address) {
  const [userProfile, setUserProfile] = useState(null);

  const initialized = async () => {
    if (!address) {
      return false;
    }

    return await isInitialized(address);
  };
  const hasSetup = async () => {
    if (!address) {
      return false;
    }
    let nftSetup = await checkSetup(address);
    let fusdSetup = await checkFUSDSetup(address);

    return nftSetup && fusdSetup;
  };

  useEffect(async () => {
    if (address && (await initialized())) {
      setUserProfile(await getProfile(address));
    }

    return null;
  }, [address]);

  return {
    userProfile,
    hasSetup,
    initialized
  };
}
