import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserOutlined, CaretDownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Price from './Price';
import {
  Card,
  CardImage,
  AssetDescription as Description,
  Text,
  ContentContainer,
  StyledAvatar,
  DropDownContainer,
  MintNumberContainer,
  MintNumber
} from './styled';
import { PlaceholderSkeletonImg } from '~/components/shared/CardStyled';

import { getImageURL } from '~/utils/getImageUrl';
import { getProfile } from '~/flow/getProfile';
import { URLs } from '~/routes/urls';
import DropDown from '~/components/dropdown/DropDown';

const Asset = ({
  imgURL,
  description,
  name,
  price,
  owner,
  id,
  actions,
  linkTo,
  mintNumber,
  showOwner = false
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoading, setImageLoading] = useState(true);

  async function getImage() {
    const ownerInfo = await getProfile(owner);

    setImageSrc(ownerInfo.avatar);
  }

  useEffect(() => {
    showOwner && getImage();
  }, []);

  const avatarSource = imageSrc ? { src: imageSrc } : { icon: <UserOutlined /> };

  function getOwner() {
    if (showOwner && owner) return <StyledAvatar size="small" {...avatarSource} />;
    return null;
  }

  function getMintNumber() {
    if (mintNumber) return <MintNumber>{`#${mintNumber}`}</MintNumber>;

    return null;
  }

  function getActions() {
    if (actions && actions.length > 0)
      return (
        <DropDownContainer>
          <DropDown title="actions" options={actions} icon={<CaretDownOutlined />} />
        </DropDownContainer>
      );

    return null;
  }

  function getImageLoading() {
    if (isImageLoading) return <PlaceholderSkeletonImg shape="square" active />;

    return null;
  }

  const Component = (
    <Card className="token-card">
      <MintNumberContainer justify={showOwner ? 'space-between' : 'end'} align="middle">
        {getOwner()}
        {getMintNumber()}
      </MintNumberContainer>
      {getImageLoading()}
      <CardImage
        width={193}
        height={182}
        layout={undefined}
        src={getImageURL(imgURL ?? '')}
        unoptimized={true}
        onLoad={() => setImageLoading(false)}
      />
      <div className="text-content">
        <ContentContainer fullWidth={!price}>
          <Text>{name}</Text>
          <Description ellipsis={{ rows: 2 }}>{description}</Description>
        </ContentContainer>
        {price && <Price price={price} />}
      </div>
      {getActions()}
    </Card>
  );

  return id ? <Link href={linkTo ?? URLs.explorer(id)}>{Component}</Link> : Component;
};

Asset.propTypes = {
  imgURL: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number,
  price: PropTypes.number,
  owner: PropTypes.shape({
    src: PropTypes.string
  }),
  showSell: PropTypes.bool,
  showCancel: PropTypes.bool,
  sell: PropTypes.func,
  cancel: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      action: PropTypes.func
    })
  ),
  linkTo: PropTypes.string,
  showOwner: PropTypes.bool
};

Asset.defaultProps = {
  showSell: false,
  showCancel: false,
  showOwner: false,
  id: null,
  owner: null,
  actions: null,
  linkTo: null
};

export default Asset;
