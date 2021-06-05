import { Row, Col } from 'antd';
import { SlidersFilled } from '@ant-design/icons';
import { useMemo, useState, useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { MarketPlaceWrapper } from '~/components/profile/styled';
import Asset from '~/components/asset/Asset';
import DropDown from '~/components/dropdown/DropDown';
import { CardLoading } from '~/components/skeleton/CardLoading';
import Seo from '~/components/seo/seo';

import { GET_NFTS_ON_SALE } from '~/store/server/subscriptions';

const MarketPlace = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const { data: { nft_sale_offer } = { nft_sale_offer: [] }, loading: isLoading } = useSubscription(
    GET_NFTS_ON_SALE
  );

  const data = useMemo(() => {
    const nftsToFilter = nft_sale_offer.filter(item =>
      item.nft.template.metadata.name.toLowerCase().includes(search.toLowerCase())
    );
    if (!filter) {
      return nftsToFilter;
    }

    if (filter === 'highestPrice') {
      return [...nftsToFilter].sort((a, b) => b.price - a.price);
    }

    if (filter === 'lowestPrice') {
      return [...nftsToFilter].sort((a, b) => a.price - b.price);
    }

    if (filter === 'createdAt') {
      return [...nftsToFilter].sort(
        (a, b) => new Date(b.nft.created_at) - new Date(a.nft.created_at)
      );
    }
  }, [filter, nft_sale_offer, search]);

  const options = [
    { title: 'Recently added', action: () => setFilter('createdAt') },
    { title: 'Lowest price', action: () => setFilter('lowestPrice') },
    { title: 'Highest price', action: () => setFilter('highestPrice') },
    { title: 'None', action: () => setFilter(null) }
  ];

  useEffect(() => {
    if (router.query.q && router.query.q.length > 0) {
      setSearch(router.query.q);
    } else if (!router.query.q) {
      setSearch('');
    }
  }, [router.query]);

  return (
    <MarketPlaceWrapper>
      <Seo title="MarketPlace" />
      <Col span={22} offset={1}>
        <Row justify="space-between">
          <h2>Marketplace</h2>
          <DropDown title="Filter & Sort" icon={<SlidersFilled />} {...{ options }} />
        </Row>
        <Row align="center">
          {isLoading
            ? [...Array(12).keys()].map(index => <CardLoading hasTopBar key={index} />)
            : data.map(({ nft, price }) => (
                <Asset
                  className="marketplace-asset"
                  key={nft.id}
                  id={nft.id}
                  imgURL={nft.template.metadata.image}
                  description={nft.template.metadata.description}
                  name={nft.template.metadata.name}
                  price={Number(price)}
                  owner={nft.owner}
                  mintNumber={nft.mint_number}
                  showOwner
                />
              ))}
        </Row>
      </Col>
    </MarketPlaceWrapper>
  );
};

export default MarketPlace;
