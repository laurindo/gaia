/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react';
import { getAsset } from '~/flow/getAsset';
import { getSales } from '~/flow/getSales';
import { getProfile } from '~/flow/getProfile';

export default function useMarketplace(userAddress) {
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  const fetchAsset = useCallback(async () => {
    try {
      if (userAddress) {
        setIsLoading(true);
        const sales = await getSales(userAddress);
        const data = await Promise.all(
          sales.map(async (sale, index) => {
            const result = await getAsset(userAddress, sale.id);
            const owner = await getProfile(sale.owner);
            return { ...result, price: sales[index].price, owner: { src: owner.avatar } };
          })
        );
        setAssets(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(fetchAsset, [fetchAsset]);

  return {
    assets,
    isLoading
  };
}
