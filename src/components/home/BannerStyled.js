import { Typography } from 'antd';
import styled from 'styled-components';

const BannerStyled = styled.div`
  margin-top: 42px;
  margin-bottom: 61px;
  padding: 70px 0px 112px 0px;
  height: ${({ theme }) => theme.sizes.homeBannerHeight};
  text-align: center;
  line-height: ${({ theme }) => theme.lineHeight.md};
  position: relative;
  z-index: 1;
`;

const BannerTitle = styled(Typography.Title)`
  &.ant-typography {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const BannerSubTitle = styled.h2`
  font-weight: ${({ theme }) => theme.fontWeight.light};
  font-size: ${({ theme }) => theme.fontSizes['xs-2']};
  margin-bottom: 20px;
  z-index: 20;
  color: ${({ theme }) => theme.colors.white};
  position: relative;
`;

const BannerImgContainer = styled.div`
  position: absolute;
  height: ${({ theme }) => theme.sizes.homeBannerHeight};
  width: 100%;
  top: 30px;
  z-index: 0;
`;

export { BannerStyled, BannerTitle, BannerSubTitle, BannerImgContainer };
