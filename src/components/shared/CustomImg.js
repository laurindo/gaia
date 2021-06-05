import React from 'react';
import Img from 'react-cool-img';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledImg = styled(Img)`
  width: 100%;
  height: 100%;
  display: block;
  background-color: ${props => (props.banner ? 'transparent' : '#eee')};
  position: relative;
  z-index: 0;
`;

function CustomImg({ src, alt, isBanner }) {
  return <StyledImg banner={isBanner} src={src} alt={alt} />;
}
CustomImg.propTypes = {
  banner: PropTypes.bool
};
export default CustomImg;
