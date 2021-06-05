import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin: 5px 0;
`;

export const Info = styled.p`
  font-weight: 700;
  margin: 0 0 0 10px;
`;

export const Role = styled.p`
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: 12px;
  font-weight: 500;
`;
