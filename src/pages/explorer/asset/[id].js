/* eslint-disable no-unused-vars */
import { useRouter } from 'next/router';
import {
  Modal,
  Typography,
  Form,
  InputNumber,
  Skeleton,
  Space,
  Row,
  Button,
  Spin,
  notification
} from 'antd';
import { Lightbox } from 'react-modal-image';
import { useMemo, useState } from 'react';
import { useSubscription, useMutation } from '@apollo/react-hooks';

import {
  ExpandedViewSkeletonButton,
  ExpandedViewSkeletonNameInput,
  ExpandedViewSkeletonCreatorInput,
  ExpandedViewSkeletonInfoInput,
  ExpandedViewSkeletonTitle,
  ExpandedViewSkeletonText,
  StyledImage,
  StyledImageContainer,
  Heading,
  ReadMore,
  Description,
  StyledButton,
  InfoHeading,
  InfoWrapper,
  Column,
  Content,
  ContentColumn
} from '~/components/asset/styled';
import Seo from '~/components/seo/seo';
import UserInfo from '~/components/userInfo/UserInfo';
import AssetInfo from '~/components/assetInfo/AssetInfo';
import OwnedBy from '~/components/ownedBy';

import useAuth from '~/hooks/useAuth';
import useBalance from '~/hooks/useBalance';
import { getImageURL } from '~/utils/getImageUrl';
import { URLs } from '~/routes/urls';

import { cancelSale } from '~/flow/cancelSale';
import { getProfile } from '~/flow/getProfile';
import { buy } from '~/flow/buy';
import { createSaleOffer } from '~/flow/sell';
import { editPrice } from '~/flow/editPrice';

import { GET_NFT } from '~/store/server/subscriptions';
import { cancelSaleOffer, checkAndInsertSale } from '~/utils/graphql';
import { UPDATE_OWNER, UPDATE_SALE_PRICE } from '~/store/server/mutations';

const { Text } = Typography;

const Sale = () => {
  const router = useRouter();
  const {
    query: { id }
  } = router;
  const [completeDescription, setCompleteDescription] = useState(false);
  const [editPriceVisible, setEditPriceVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingSale, setIsLoadingSale] = useState(false);
  const [asset, setAsset] = useState(null);
  const [openLightbox, setOpenLightbox] = useState(false);

  const [form] = Form.useForm();
  const { user } = useAuth();

  const { updateUser } = useBalance();

  useSubscription(GET_NFT, {
    variables: {
      id
    },
    onSubscriptionData: async ({
      subscriptionData: {
        data: { nft }
      }
    }) => {
      const creatorProfile = await getProfile(nft[0]?.collection.author);
      const ownerInfo = await getProfile(nft[0]?.owner);
      setAsset({
        isLoading: false,
        isOnSale: nft[0].is_for_sale,
        ownerProfile: {
          address: nft[0].owner,
          name: ownerInfo.name
        },
        fullMetadata: nft[0].template.metadata,
        id: nft[0].id,
        asset_id: nft[0]?.asset_id,
        template_id: nft[0]?.template.template_id,
        imgURL: nft[0].template.metadata.image,
        name: nft[0].template.metadata.name,
        description: nft[0].template.metadata.description,
        saleOffers: nft[0].sale_offers,
        mintNumber: nft[0].mint_number,
        collection: nft[0].collection,
        creatorProfile
      });
    }
  });

  const [updateOwner] = useMutation(UPDATE_OWNER);

  const [updatePrice] = useMutation(UPDATE_SALE_PRICE);

  const description = useMemo(() => {
    if (completeDescription || asset?.description?.length < 330) {
      return asset?.description;
    } else {
      return `${asset?.description?.substr(0, 330)}...`;
    }
  }, [completeDescription, asset]);

  //This function handle the buy sale
  const handleBuy = async saleId => {
    setIsModalLoading(true);
    try {
      notification.open({
        key: `buy_sale_${saleId}`,
        message: `Buying sale offer #${saleId}`,
        description: 'You gonna be prompted to accept this transaction',
        icon: <Spin />,
        duration: null
      });
      await buy(Number(saleId), asset?.ownerProfile?.address);
      updateOwner({
        variables: {
          assetId: Number(saleId),
          owner: user?.addr
        }
      });
      updateUser();
      notification.open({
        key: `buy_sale_${saleId}`,
        type: 'success',
        message: `You bought sale offer #${saleId} `,
        description: `Your have bought sale offer #${saleId} successfully`
      });
    } catch (error) {
      notification.open({
        key: `buy_sale_${saleId}`,
        type: 'error',
        message: `Error on buy sale offer #${saleId}  `,
        description: `Your sale offer for ID #${saleId} has failed`
      });
    }
  };

  //This function handles the edit sale price
  const handleEditPrice = async ({ newPrice }) => {
    setIsModalLoading(true);
    try {
      await editPrice(user?.addr, Number(asset.asset_id), Number(newPrice));
      await updatePrice({
        variables: {
          asset_id: Number(asset.asset_id),
          price: String(newPrice)
        }
      });
      setIsModalLoading(false);

      notification.success({
        key: `edit_sale_${asset.asset_id}`,
        message: `Price successfully updated!`
      });
    } catch (error) {
      setIsModalLoading(false);
      notification.error({
        key: `edit_sale_${asset.asset_id}`,
        message: `Failed to update price`
      });
    } finally {
      setEditPriceVisible(false);
    }
  };

  //This function handle the cancel sale
  const handleCancelSale = async () => {
    setCancelModalVisible(false);
    try {
      notification.open({
        key: `cancel_sale_${asset?.asset_id}`,
        message: `Canceling sale offer for ID #${asset?.asset_id}`,
        description: 'You gonna be prompted to accept this transaction',
        icon: <Spin />,
        duration: null
      });
      await cancelSale(asset?.asset_id);
      await cancelSaleOffer(asset?.asset_id, asset?.id); //graphql mutation
      notification.open({
        key: `cancel_sale_${asset?.asset_id}`,
        type: 'success',
        message: `Sale offer #${asset?.asset_id} canceled `,
        description: `Your sale offer for ID #${asset?.asset_id} is canceled`
      });
    } catch (error) {
      notification.open({
        key: `cancel_sale_${asset?.asset_id}`,
        type: 'error',
        message: `Canceling sale offer #${asset?.asset_id} failed `,
        description: `Your sale offer for ID #${asset?.asset_id} has failed`
      });
    }
  };

  //It renders Edit Price and Cancel Sale if asset is on sale and current user is the owner
  const renderSaleOwnerOptions = () => {
    return asset?.isOnSale && user?.addr === asset?.ownerProfile?.address ? (
      <>
        {' '}
        <StyledButton
          $margin
          type="primary"
          shape="round"
          onClick={() => setEditPriceVisible(true)}>
          Edit price
        </StyledButton>
        <StyledButton
          $margin
          cancel
          type="danger"
          shape="round"
          onClick={() => setCancelModalVisible(true)}>
          Cancel Sale
        </StyledButton>
        <Modal
          visible={editPriceVisible}
          title="Insert new price"
          onCancel={() => setEditPriceVisible(false)}
          onOk={() => form.submit()}
          okButtonProps={{
            loading: isModalLoading
          }}
          destroyOnClose>
          <Form form={form} onFinish={handleEditPrice}>
            <Form.Item>
              <Text type="secondary">{`Listing your asset on Market`}</Text>
            </Form.Item>
            <Form.Item
              name="newPrice"
              rules={[
                {
                  required: true,
                  message: 'You cannot leave price empty'
                }
              ]}>
              <InputNumber
                step={0.00000001}
                min={0.00000001}
                style={{ width: '100%' }}
                placeholder="10.00000000 FLOW"
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={cancelModalVisible}
          title={`Do you want to cancel your sale for item (#${asset?.id})`}
          onCancel={() => setCancelModalVisible(false)}
          onOk={handleCancelSale}
          okButtonProps={{
            loading: isModalLoading
          }}
          okText="Cancel Sale"
          cancelText="Keep Listed"
          destroyOnClose>
          <Typography>This action will remove your sale from the marketplace.</Typography>
        </Modal>
      </>
    ) : null;
  };

  //It renders only if user is the owner and asset is not in sale yet
  const renderAssetOwner = () => {
    return !asset?.isOnSale && user?.addr === asset?.ownerProfile?.address ? (
      <>
        <StyledButton type="primary" shape="round" onClick={() => sellAsset()}>
          List on Market
        </StyledButton>
        <Modal
          visible={modalVisible}
          title={`How much do you want for this asset (${asset?.name} - ${asset?.asset_id})`}
          footer={[
            <Button key="back" onClick={() => setModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={isLoadingSale}
              onClick={() => {
                setModalVisible(false);
                form.submit();
              }}>
              Sell
            </Button>
          ]}>
          <Form form={form} onFinish={onFinishSale}>
            <Form.Item>
              <Text type="secondary">{`Listing your asset on Market`}</Text>
            </Form.Item>
            <Form.Item
              name="price"
              rules={[
                {
                  required: true,
                  message: 'You cannot leave price empty'
                }
              ]}>
              <InputNumber
                step={0.00000001}
                min={0.00000001}
                style={{ width: '100%' }}
                placeholder="10.00000000 FLOW"
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    ) : null;
  };

  //It renders only if you are not the asset owner
  const renderMarketOptions = () => {
    if (asset?.saleOffers?.length > 0 && user?.addr !== asset?.ownerProfile?.address) {
      return (
        <StyledButton
          $margin
          type="primary"
          shape="round"
          onClick={() => handleBuy(asset?.asset_id)}>
          Buy
        </StyledButton>
      );
    }
    if (!asset?.isOnSale && user?.addr !== asset?.ownerProfile?.address) {
      return (
        <StyledButton type="primary" shape="round" disabled>
          This asset is not on sale
        </StyledButton>
      );
    }
  };

  //It just open the sell modal
  const sellAsset = () => {
    setModalVisible(true);
  };
  //It handle the form submit of sell modal
  const onFinishSale = async ({ price }) => {
    try {
      notification.open({
        key: `sale_${asset?.asset_id}`,
        message: `Creating an offer for ID #${asset?.asset_id}`,
        description: 'You gonna be prompted to accept this transaction',
        icon: <Spin />,
        duration: null
      });
      // createSaleOffer(ASSET_ID, PRICE, MARKET_FEE, TEMPLATE_ID)
      await createSaleOffer(asset?.asset_id, price, asset?.template_id);
      // checkAndInsertSale(ASSET_ID, DATABASE ID, PRICE)
      await checkAndInsertSale(asset?.asset_id, asset?.id, price);
      notification.open({
        key: `sale_${asset?.asset_id}`,
        type: 'success',
        message: `Sale for ID #${asset?.asset_id} created `,
        description: `Your sale offer for ID #${asset?.asset_id} is created`
      });
    } catch (err) {
      console.warn(err);
      notification.open({
        key: `sale_${asset?.asset_id}`,
        type: 'error',
        message: `Sale for ID #${asset?.asset_id} failed `,
        description: `Your sale offer for ID #${asset?.asset_id} has failed`
      });
    }
    form.resetFields();
  };

  return (
    <>
      <Row justify="center">
        <Seo title="Details" imgURL={getImageURL(asset?.imgURL ?? '')} />
        {asset == null ? (
          <>
            {/* Skeleton */}
            <Column span={6} offset={2}>
              <Skeleton.Button active size={550} />
            </Column>
            <Column span={8} offset={2}>
              <Content>
                <ExpandedViewSkeletonTitle />
                <Space direction="horizontal">
                  <Skeleton.Avatar active size="large" />
                  <Space direction="vertical">
                    <ExpandedViewSkeletonNameInput active size="small" />
                    <ExpandedViewSkeletonCreatorInput active size="small" />
                  </Space>
                </Space>
                <ExpandedViewSkeletonText active />
                <ExpandedViewSkeletonText active />
                <ExpandedViewSkeletonText active />
                <ExpandedViewSkeletonText active />
                <ExpandedViewSkeletonText active />
                <ExpandedViewSkeletonText active />

                <ExpandedViewSkeletonInfoInput $width={50} $marginTop={10} active />
                <ExpandedViewSkeletonInfoInput $width={30} $marginTop={10} active />
                <ExpandedViewSkeletonInfoInput $width={100} active />
                <ExpandedViewSkeletonInfoInput $width={90} active />
                <ExpandedViewSkeletonInfoInput $width={95} active />
                <ExpandedViewSkeletonButton active size="small" shape="round" />
              </Content>
            </Column>
            {/* End of Skeleton */}
          </>
        ) : (
          <>
            <>
              <StyledImageContainer>
                <StyledImage
                  isClickable
                  onClick={() => setOpenLightbox(true)}
                  src={getImageURL(asset?.imgURL ?? '')}
                />
              </StyledImageContainer>
            </>
            <ContentColumn xs={24} xl={8} md={8} sm={8}>
              <Content>
                <Heading>{asset?.name}</Heading>
                <UserInfo
                  name={asset?.creatorProfile?.name}
                  src={getImageURL(asset?.creatorProfile?.avatar ?? '')}
                  type="Creator"
                />
                <Description>
                  {description}{' '}
                  {description?.length > 330 && (
                    <ReadMore onClick={() => setCompleteDescription(prevState => !prevState)}>
                      Show {completeDescription ? 'less' : 'more'}
                    </ReadMore>
                  )}
                </Description>
                <InfoWrapper>
                  <InfoHeading>Info</InfoHeading>
                  <AssetInfo
                    metadata={asset?.fullMetadata}
                    id={asset?.asset_id}
                    price={asset?.isOnSale ? asset?.saleOffers[0]?.price : null}
                    collection={asset?.collection.name}
                    mintNumber={asset?.mintNumber}
                  />
                  <OwnedBy
                    title="Owned by"
                    ownerName={asset?.ownerProfile?.name}
                    link={URLs.profile(asset?.ownerProfile?.address)}
                  />
                  {openLightbox && (
                    <Lightbox
                      medium={asset?.imgURL}
                      large={asset?.imgURL}
                      alt={asset?.name}
                      onClose={() => setOpenLightbox(false)}
                      hideDownload
                      showRotate={false}
                      hideZoom
                    />
                  )}
                  {(asset?.saleOffers?.length === 0 && renderAssetOwner()) ||
                    (asset?.saleOffers?.some(offer => offer.status !== 'active') &&
                      renderAssetOwner())}
                  {renderMarketOptions()} {/* Buy button or This asset is not on sale */}
                  {renderSaleOwnerOptions()} {/*Edit and Cancel sale buttons */}
                </InfoWrapper>
              </Content>
            </ContentColumn>
          </>
        )}
      </Row>
    </>
  );
};

export default Sale;
