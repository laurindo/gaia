import Image from 'next/image';
import { Price, PriceContainer } from './styled';
import formatPrice from '~/utils/formatPrice';

function AssetPrice({ value }) {
  return (
    <PriceContainer>
      <Image src="/images/flow-black.png" width={24} height={24} object-fit="contain" />
      <Price>{formatPrice(value)}</Price>
    </PriceContainer>
  );
}

export default AssetPrice;
