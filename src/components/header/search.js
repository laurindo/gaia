import { useState } from 'react';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Col, Row } from 'antd';
import {
  AutoCompleteStyled,
  OptionStyled,
  SubmitInput,
  StyledForm,
  DropdownImage,
  DropdownText
} from '~/components/header/styled';
import { useSubscription } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { GET_NFTS_ON_SALE } from '~/store/server/subscriptions';
import { getImageURL } from '~/utils/getImageUrl';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: { nft_sale_offer } = { nft_sale_offer: [] } } = useSubscription(GET_NFTS_ON_SALE);

  const getDropdownData = q => {
    return q.length >= 3
      ? nft_sale_offer.filter(item =>
          item.nft.template.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
  };

  function onSubmit(e) {
    e.preventDefault();
    if (searchQuery.length === 0 || searchQuery.replaceAll(' ', '').length === 0) {
      return;
    }

    router.push(`/market?q=${searchQuery}`);
  }

  function onClickDropdown(id) {
    setSearchQuery('');
    router.push(`/explorer/asset/${id}`);
  }

  return (
    <StyledForm onSubmit={onSubmit}>
      <AutoCompleteStyled
        value={searchQuery}
        size="large"
        onChange={setSearchQuery}
        defaultActiveFirstOption={false}
        onSelect={onClickDropdown}
        allowClear
        placeholder={
          <Row justify="space-between">
            <Col>Search items</Col>
            <Col>
              <SearchOutlined />
            </Col>
          </Row>
        }
        dropdownMatchSelectWidth>
        {getDropdownData(searchQuery).map(item => (
          <OptionStyled key={`drpdwn-${item.nft.id}`} value={item.nft.id}>
            <Row align="middle">
              <DropdownImage
                objectFit="contain"
                width={50}
                height={50}
                src={getImageURL(item.nft.template.metadata.image)}
              />
              <DropdownText>{item.nft.template.metadata.name}</DropdownText>
            </Row>
          </OptionStyled>
        ))}
      </AutoCompleteStyled>
      <SubmitInput type="submit" hidefocus="true" />
    </StyledForm>
  );
}

export default Search;
