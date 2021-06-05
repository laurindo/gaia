import styled from 'styled-components';

const RecentlyAddedHeader = styled.div`
  & .ant-divider-horizontal {
    margin: 9px 0px 0px 0px;
  }
`;

export const RecentlyAddedHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: ${({ theme }) => theme.fontWeight.normal};
`;

export const RecentlyAddedHeaderSpan = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  line-height: ${({ theme }) => theme.lineHeight.sm};
`;

export default RecentlyAddedHeader;
