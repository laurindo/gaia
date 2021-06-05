import Link from 'next/link';
import styled from 'styled-components';

const LinkStyled = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  color: ${({ theme }) => theme.colors.headerLink};
  &:hover {
    color: ${({ theme }) => theme.colors.headerLink};
    cursor: pointer;
  }
`;

export const LinkContainer = styled.div`
  margin-right: 20px;
`;

export const LinkContent = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  &:hover {
    cursor: pointer;
  }
`;

export const LinkText = styled.span`
  margin-right: 5px;
`;

export default LinkStyled;
