import { useState, useEffect, useCallback } from 'react';
import { listNfts } from '~/flow/listNfts';

export default function useInventory(address) {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const listAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await listNfts(address);
      setAssets(items);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(listAssets, [listAssets]);

  return {
    assets,
    isLoading
  };
}
