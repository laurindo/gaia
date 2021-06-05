/* eslint-disable no-console */
import { Col, Typography } from 'antd';
const { Text } = Typography;
import Price from '~/components/shared/Price';
import { objectRemover } from '~/utils/objectRemover';
import { capitalize } from '~/utils/string';
import { CustomRow as Row, Wrapper } from './styled';

function AssetInfo({ metadata, price, id, mintNumber, collection }) {
  const cleanMetadata = objectRemover(['image', 'description', 'name'], metadata);
  const infoKey = Object.keys(cleanMetadata);
  return (
    <Wrapper>
      <Row>
        <Col span={8}>
          <Text strong>ID</Text>
        </Col>
        <Col span={16}>
          <Text>{id}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Text strong>Mint Number</Text>
        </Col>
        <Col span={16}>
          <Text>{mintNumber}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Text strong>Collection</Text>
        </Col>
        <Col span={16}>
          <Text>{collection}</Text>
        </Col>
      </Row>
      {infoKey &&
        infoKey.map((info, index) => {
          return (
            <Row key={index}>
              <Col span={8}>
                <Text strong>{info}</Text>
              </Col>
              <Col span={16}>
                <Text>{capitalize(cleanMetadata[info])}</Text>
              </Col>
            </Row>
          );
        })}
      {price && (
        <Row>
          <Col span={8}>
            <Text strong>Price:</Text>
          </Col>
          <Col span={16}>
            <Price value={price} />
          </Col>
        </Row>
      )}
    </Wrapper>
  );
}

export default AssetInfo;
