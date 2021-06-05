import { useState, useEffect, useCallback } from 'react';
import { getAsset } from '~/flow/getAsset';
import { getSaleOffer } from '~/flow/getSaleOffer';
import useProfile from './useProfile';

export default function useAsset(saleID, userAddress) {
  const [asset, setAsset] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useProfile(userAddress);
  const getSale = useCallback(async () => {
    if (!saleID || !userProfile) return setIsLoading(true);
    if (saleID && userProfile) {
      try {
        setIsLoading(true);
        const asset = await getAsset(userAddress, Number(saleID));
        const [marketSale] = await getSaleOffer(userAddress, Number(saleID));
        const price = marketSale?.price ?? null;
        const owner = marketSale?.owner ?? null;
        setAsset({ ...asset, ownerProfile: userProfile, price, owner, isOnSale: !!price });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [saleID, userAddress, userProfile]);

  useEffect(getSale, [getSale]);

  return {
    getAsset,
    asset,
    isLoading
  };
}
