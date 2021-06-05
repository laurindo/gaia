import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

import { Container, Content, Description, Title, Icon, CheckIcon } from './styled';

const FeedbackItem = ({ completed, title, description }) => {
  return (
    <Container>
      <Icon>
        {completed ? <CheckIcon /> : <Image src="/icons/pacman.svg" width={80} height={80} />}
      </Icon>

      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
    </Container>
  );
};

FeedbackItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  completed: PropTypes.bool
};

FeedbackItem.defaultProps = {
  completed: false
};

export default FeedbackItem;
