/* eslint-disable no-unused-vars */
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import { Col, Divider, Row } from 'antd';
import { useSubscription } from '@apollo/react-hooks';

import Banner from '~/components/home/Banner';
import RecentlyAddedHeader, {
  RecentlyAddedHeaderContent,
  RecentlyAddedHeaderSpan
} from '~/components/home/RecentlyAddedHeader';
import SetsList from '~/components/home/SetsList';
import LinkStyled, { LinkContent, LinkText } from '~/components/shared/LinkStyled';
import Seo from '~/components/seo/seo';

import { HomeWrapper } from '~/components/profile/styled';
import { URLs } from '~/routes/urls';
import { CardLoading } from '~/components/skeleton/CardLoading';

import { GET_NFTS_ON_SALE } from '~/store/server/subscriptions';
import { getImageURL } from '~/utils/getImageUrl';

export default function Home() {
  const { data: { nft_sale_offer } = { nft_sale_offer: [] }, loading } = useSubscription(
    GET_NFTS_ON_SALE
  );
  function renderSets() {
    if (loading) {
      return [...Array(8).keys()].map(index => <CardLoading hasTopBar={false} key={index} />);
    }
    return <SetsList sets={nft_sale_offer} />;
  }

  return (
    <HomeWrapper>
      <Seo title="Home" />
      <Col span={20} offset={2}>
        <Row>
          <Col span={24}>
            <Banner />
          </Col>
        </Row>
        <Row gutter={[21, 21]}>
          <Col span={24}>
            <RecentlyAddedHeader>
              <RecentlyAddedHeaderContent>
                <RecentlyAddedHeaderSpan>Recently Added</RecentlyAddedHeaderSpan>
                <LinkStyled href={URLs.marketplace}>
                  <LinkContent>
                    <LinkText>View All</LinkText>
                    <ArrowRightOutlined />
                  </LinkContent>
                </LinkStyled>
              </RecentlyAddedHeaderContent>
              <Divider />
            </RecentlyAddedHeader>
          </Col>
          <Col span={24}>
            <Row align="center" gutter={[20, 20]}>
              {renderSets()}
            </Row>
          </Col>
        </Row>
      </Col>
    </HomeWrapper>
  );
}
