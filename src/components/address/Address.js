import { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

import { truncate } from '~/utils/string';

import { Container, Text } from './styled';

const Address = ({ children }) => {
  const [isFocused, setFocused] = useState(false);
  const shortenedAddress = truncate(children, 11, -3, '...');

  const copyToClipboard = () => {
    setFocused(true);
    navigator.clipboard.writeText(children);
    setTimeout(() => {
      setFocused(false);
    }, 3000);
  };

  return (
    <Container className="address" onClick={copyToClipboard} {...{ isFocused }}>
      <Text>{shortenedAddress}</Text>
      <Image src="/icons/copy.svg" width={16} height={16} />
    </Container>
  );
};

Address.propTypes = {
  children: PropTypes.string.isRequired
};

export default Address;
