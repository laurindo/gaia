import Image from 'next/image';
import { PriceContainer, Price as StyledPrice } from './styled';
import formatPrice from '~/utils/formatPrice';

export default function Price({ price = '' }) {
  return (
    <PriceContainer>
      <Image src="/images/flow-black.png" width={20} height={20} object-fit="contain" />
      <StyledPrice>{formatPrice(price)}</StyledPrice>
    </PriceContainer>
  );
}
