import { useState, useEffect } from 'react';
import { Col, Row, Card, Typography, Button, Skeleton } from 'antd';
const { Text } = Typography;
import { DropListWrapper, AssetWrapper } from '../../components/drops/styled';

import useBlockPage from '~/hooks/useBlockPage';

function DropsList() {
  const { shouldPageBlock } = useBlockPage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    shouldPageBlock();
  }, []);

  const AttrRow = ({ title, value }) => (
    <Row className="infoRow" justify="space-around">
      <Col span={10}>
        <Text className="title" size={16}>
          {title}
        </Text>
      </Col>
      <Col span={12}>
        <Text>{value}</Text>
      </Col>
    </Row>
  );

  const Asset = () => (
    <AssetWrapper>
      <div className="imageContainer">
        <div className="imagePreview">
          <img
            alt="asset"
            className="image"
            src="https://resizer.atomichub.io/images/v1/preview?ipfs=QmVo3dwAs391eVYqs6J7EvAd9w2jSPZgiaXp4bh4zdgb3y&size=370"
          />
        </div>
      </div>
      <div className="contentContainer">
        <div className="content">
          <Text className="assetId">#116259</Text>
          <Text className="assetName">SAFEST CITIES PACK</Text>
          <Text className="assetQuantity">43 assets</Text>
        </div>
      </div>
    </AssetWrapper>
  );

  const Drop = () => (
    <Col className="drop" span={20}>
      <Row justify="space-between" align="center">
        <Col span={10}>
          <Row justify="center">
            <Asset />
            <Asset />
          </Row>
        </Col>
        <Col span={12}>
          <Card className="infoCard">
            <AttrRow title="Drop ID" value="#28393" />
            <AttrRow title="Collection" value="jamesjohnson" />
            <AttrRow title="Claimed" value="0/100" />
            <AttrRow title="Price" value="15.000000000 FLOW" />
            <Col span={24}>
              <Button type="primary" style={{ width: '100%', borderRadius: 20, marginTop: 30 }}>
                Show drop
              </Button>
            </Col>
          </Card>
        </Col>
      </Row>
    </Col>
  );

  const DropSkeleton = () => (
    <Col className="drop" span={20}>
      <Row justify="space-between">
        <Col span={10}>
          <Row justify="center">
            <Skeleton.Input active style={{ width: 165, height: 264, borderRadius: 20 }} />
          </Row>
        </Col>
        <Col span={12}>
          <Skeleton.Input active style={{ width: 398, height: 264, borderRadius: 20 }} />
        </Col>
      </Row>
    </Col>
  );

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <DropListWrapper justify="center">
      {isLoading ? (
        <>
          {Array(4)
            .fill(0)
            .map(() => (
              <DropSkeleton key={Math.random().toString()} />
            ))}
        </>
      ) : (
        <>
          {Array(4)
            .fill(0)
            .map(() => (
              <Drop key={Math.random().toString()} />
            ))}
        </>
      )}
    </DropListWrapper>
  );
}

export default DropsList;
