import { Col, Tooltip } from 'antd';
import React from 'react';
import CardStyled, {
  CardBottomOptions,
  CardBottomText,
  CardTitle,
  CardTitleContainer
} from './CardStyled';
import CustomImg from './CustomImg';

function NftCard({ title, asset, price, mint }) {
  const name = asset.data?.name?.slice(0, 45) ?? '<Unavailable name>';
  const priceAmount = price ? parseFloat(price.amount) / 10 ** price.token_precision : '';
  const priceSymbol = price ? price.token_symbol : '';
  const collectionName = asset.collection?.collection_name ?? '<Unavailable name>';

  const imgSrc = null;

  return (
    <Col>
      <CardStyled
        hoverable
        title={title}
        cover={<CustomImg alt={name} src={imgSrc} />}
        key={asset.asset_id}
        onClick={() => alert('push to some page')}>
        <div>
          <span>{collectionName}</span>
        </div>
        <CardTitleContainer>
          <Tooltip title={`${name}#${mint}`}>
            <CardTitle>
              {name}#{mint}
            </CardTitle>
          </Tooltip>
        </CardTitleContainer>
        <CardBottomOptions>
          <CardBottomText>
            {priceSymbol} {priceAmount}
          </CardBottomText>
        </CardBottomOptions>
      </CardStyled>
    </Col>
  );
}

export default NftCard;
