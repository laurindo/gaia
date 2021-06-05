import styled, { css, keyframes } from 'styled-components';

const brieflyShowBorder = keyframes`
  33% {
    border: 1px solid #0057ff;
  }
  100% {
    border: 1px solid #fff;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 45px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  ${({ isFocused }) =>
    isFocused &&
    css`
      animation: 3s ${brieflyShowBorder} ease-out;
    `}
`;

export const Text = styled.p`
  color: #0057ff;
  margin: 0;
  font-weight: 400;
  margin-right: 10px;
`;
