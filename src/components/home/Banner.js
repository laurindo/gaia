import { Button } from 'antd';
import React from 'react';
import { useRouter } from 'next/router';
import CustomImg from '../shared/CustomImg';
import { URLs } from '~/routes/urls';
import { BannerImgContainer, BannerStyled, BannerSubTitle, BannerTitle } from './BannerStyled.js';

function Banner() {
  const router = useRouter();
  return (
    <>
      <BannerImgContainer>
        <CustomImg isBanner alt="banner" src="/static/img/home-banner.png" />
      </BannerImgContainer>
      <BannerStyled>
        <BannerTitle type="secondary">The largest NFT marketplace</BannerTitle>
        <BannerSubTitle>Buy, sell, and discover rare digital items</BannerSubTitle>
        <Button onClick={() => router.push(URLs.create)} type="primary" shape="round">
          Create an NFT
        </Button>
      </BannerStyled>
    </>
  );
}

export default Banner;
