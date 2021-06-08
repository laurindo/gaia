import { useEffect } from 'react';
import { Col, Typography, Row, notification } from 'antd';
import { useRouter } from 'next/router';
import { useSubscription } from '@apollo/react-hooks';

import { CreateNFTWrapper } from '~/components/profile/styled';
import Seo from '~/components/seo/seo';
import { StyledButton } from '~/components/asset/styled';
import Asset from '~/components/asset/Asset';
import { CardLoading } from '~/components/skeleton/CardLoading';
import { URLs } from '~/routes/urls';

import { GET_COLLECTIONS } from '~/store/server/subscriptions';
import useAuth from '~/hooks/useAuth';
import useBlockPage from '~/hooks/useBlockPage';

function Collections() {
  const shouldPageBlock = useBlockPage();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    shouldPageBlock();
  }, []);

  const { loading, data: { nft_collection } = { nft_collection: [] } } = useSubscription(
    GET_COLLECTIONS,
    {
      variables: { author: user?.addr }
    }
  );

  return (
    <>
      <CreateNFTWrapper>
        <Seo title="Collections" />
        <Col offset={3} span={14}>
          <Typography.Title>Select a Collection</Typography.Title>
        </Col>
        <Col>
          <StyledButton
            type="primary"
            shape="round"
            style={{ margin: 35 }}
            onClick={() => router.push(URLs.createCollection)}>
            Create Collection
          </StyledButton>
        </Col>
        <Col offset={3} span={18}>
          <Row>
            {loading
              ? [...Array(12).keys()].map(index => <CardLoading hasTopBar key={index} />)
              : nft_collection.map(({ collection_id, name, image, description }) => {
                  let actions = [
                    {
                      title: 'Lock Collection',
                      action: e => {
                        e.domEvent.stopPropagation();
                        notification.open({
                          key: `lock_collection_${collection_id}`,
                          type: 'info',
                          message: `Lock Collection Not Implemented`,
                          description: `Lock Collection function not implemented on backend yet`
                        });
                      }
                    }
                  ];
                  return (
                    <Asset
                      key={collection_id}
                      id={collection_id}
                      imgURL={image}
                      description={description}
                      name={name}
                      actions={actions}
                      linkTo={URLs.templates(collection_id)}
                    />
                  );
                })}
          </Row>
        </Col>
      </CreateNFTWrapper>
    </>
  );
}

export default Collections;
