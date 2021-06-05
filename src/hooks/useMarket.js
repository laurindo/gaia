import { useState, useEffect, useCallback } from 'react';
import { getSales } from '~/flow/getSales';

export default function useMarket(address) {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const listSales = useCallback(async () => {
    if (address) {
      try {
        setIsLoading(true);
        const items = await getSales(address);
        setSales(items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [address]);

  const checkIfTokenIsOnSale = tokenId => {
    const filteredArr = sales.filter(item => item.id === tokenId);
    return filteredArr.length > 0;
  };

  useEffect(listSales, [listSales]);

  return {
    sales,
    isLoading,
    checkIfTokenIsOnSale
  };
}
