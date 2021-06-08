import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Space, Row, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/react-hooks';

import {
  ExpandedViewSkeletonButton,
  ExpandedViewSkeletonImage,
  ExpandedViewSkeletonInput,
  ExpandedViewSkeletonParagraph,
  StyledImage,
  StyledImageContainer,
  Heading,
  OwnerName,
  StyledButton,
  InfoHeading,
  InfoWrapper,
  Price as Highlight,
  Column,
  AmountContainer,
  Content,
  ContentColumn
} from '~/components/asset/styled';
import { getImageURL } from '~/utils/getImageUrl';
import { URLs } from '~/routes/urls';
import { appName } from '~/config/config';

import useBlockPage from '~/hooks/useBlockPage';

import { GET_DROP_BY_ID } from '~/store/server/subscriptions';

const DropDetails = () => {
  const shouldPageBlock = useBlockPage();
  const router = useRouter();
  const {
    query: { id }
  } = router;
  const [drop, setDrop] = useState({});
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    shouldPageBlock();
  }, []);

  const { loading: isLoading } = useSubscription(GET_DROP_BY_ID, {
    variables: {
      id
    },
    onSubscriptionData: ({
      subscriptionData: {
        data: { nft_drops }
      }
    }) => {
      setDrop(nft_drops[0]);
    }
  });

  const dateString = `${new Date(drop?.end_time).getMonth() + 1}/${new Date(
    drop?.end_time
  ).getDate()}/${new Date(drop?.end_time).getFullYear()}`;

  const changeAmountBy = num => {
    const sum = amount + num;

    if (sum > drop?.total_claimable - drop?.claimed) return;

    if (sum < 0) return;

    setAmount(sum);
  };

  return (
    <Row justify="center">
      <Head>
        <title>Drop | {appName}</title>
      </Head>
      {isLoading ? (
        <>
          {/* Skeleton */}
          <Column span={6} offset={2}>
            <ExpandedViewSkeletonImage active />
          </Column>
          <Column span={8} offset={2}>
            <Content>
              <ExpandedViewSkeletonParagraph active title paragraph={{ rows: 2 }} />
              <Space direction="horizontal">
                <Skeleton.Avatar active size="large" />
                <Space direction="vertical">
                  <ExpandedViewSkeletonInput active size="small" />
                  <ExpandedViewSkeletonInput active size="small" />
                </Space>
              </Space>
              <ExpandedViewSkeletonButton active size="large" shape="round" />
            </Content>
          </Column>
          {/* End of Skeleton */}
        </>
      ) : (
        <>
          <Column span={6} offset={2}>
            <StyledImageContainer>
              <StyledImage src={getImageURL(drop?.template?.metadata?.image ?? '')} />
            </StyledImageContainer>
          </Column>
          <ContentColumn span={8}>
            <Content>
              <div>
                <Heading>{drop?.name}</Heading>
                <p>
                  Sold by{' '}
                  <Link href={URLs.profile('123')}>
                    <OwnerName>{drop?.template?.metadata?.seller}</OwnerName>
                  </Link>
                </p>
              </div>
              <InfoWrapper noMargin>
                <InfoHeading>Info</InfoHeading>
                <p>
                  Price: <Highlight>{Number(drop?.price).toFixed(4)}</Highlight>
                </p>
                <p>
                  Available:
                  <Highlight>
                    {drop?.claimed}/{drop?.total_claimable}
                  </Highlight>
                </p>
                <p>
                  Ending: <Highlight>{dateString}</Highlight>
                </p>
                <AmountContainer>
                  <StyledButton
                    type="primary"
                    shape="round"
                    onClick={() => changeAmountBy(-1)}
                    style={{ width: 50 }}>
                    -
                  </StyledButton>
                  <Highlight>{amount}</Highlight>
                  <StyledButton
                    type="primary"
                    shape="round"
                    onClick={() => changeAmountBy(1)}
                    style={{ width: 50 }}>
                    +
                  </StyledButton>
                </AmountContainer>
                <StyledButton type="primary" shape="round" disabled={amount === 0}>
                  Buy
                </StyledButton>
              </InfoWrapper>
            </Content>
          </ContentColumn>
        </>
      )}
    </Row>
  );
};

export default DropDetails;
