/* eslint-disable no-console */
import { OwnerName } from '../asset/styled';
import { Wrapper } from './styled';
import Link from 'next/link';

function OwnedBy({ title, link, ownerName }) {
  return (
    <Wrapper>
      <p>{title}</p>
      <Link href={link}>
        <OwnerName>{ownerName}</OwnerName>
      </Link>
    </Wrapper>
  );
}

export default OwnedBy;
