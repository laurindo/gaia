import { Col, Typography, Row, notification, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import { useEffect } from 'react';

import { CreateNFTWrapper } from '~/components/profile/styled';
import Seo from '~/components/seo/seo';
import { StyledButton } from '~/components/asset/styled';
import Asset from '~/components/asset/Asset';
import { CardLoading } from '~/components/skeleton/CardLoading';
import { URLs } from '~/routes/urls';
import useAuth from '~/hooks/useAuth';
import useBlockPage from '~/hooks/useBlockPage';

import { GET_TEMPLATES } from '~/store/server/subscriptions';
import { MINT } from '~/store/server/mutations';

function Templates() {
  const { shouldPageBlock } = useBlockPage();
  const { user } = useAuth();
  const router = useRouter();
  const { query, push } = router;
  const { collectionId } = query;

  useEffect(() => {
    shouldPageBlock();
  }, []);

  const { loading, data: { nft_template } = { nft_template: [] } } = useSubscription(
    GET_TEMPLATES,
    {
      variables: { id: Number(collectionId) }
    }
  );

  const [mint] = useMutation(MINT);

  const handleMint = async (templateId, collection_id, template_name) => {
    try {
      notification.open({
        key: `mint_template_${templateId}`,
        message: `Minting ${template_name} template`,
        description: 'Sending transaction to the blockchain',
        icon: <Spin />,
        duration: null
      });
      await mint({
        variables: {
          recipient: user?.addr,
          setID: collection_id,
          templateID: templateId
        }
      });
      notification.open({
        key: `mint_template_${templateId}`,
        type: 'success',
        message: `You have minted ${template_name} template `,
        description: `Your have successfully minted ${template_name} template`
      });
      setTimeout(() => {
        router.push(`/profile/${user?.addr}`);
      }, 2000);
    } catch (error) {
      notification.open({
        key: `mint_template_${templateId}`,
        type: 'error',
        message: `Error on mint ${template_name} template  `,
        description: `Your template mint failed for ${template_name}`
      });
    }
  };

  return (
    <>
      <CreateNFTWrapper>
        <Seo title="Collections" />
        <Col offset={3} span={14}>
          <Typography.Title>Select a Template</Typography.Title>
        </Col>
        <Col>
          <StyledButton
            type="primary"
            shape="round"
            style={{ margin: 35 }}
            onClick={() => push(URLs.createTemplate(collectionId))}>
            Create Template
          </StyledButton>
        </Col>
        <Col offset={3} span={18}>
          <Row>
            {loading
              ? [...Array(12).keys()].map(index => <CardLoading hasTopBar key={index} />)
              : nft_template.map(({ template_id, metadata, collection: { collection_id } }) => (
                  <Asset
                    key={template_id}
                    imgURL={metadata.image}
                    description={metadata.description}
                    name={metadata.name}
                    actions={[
                      {
                        title: 'Mint NFT',
                        action: () => handleMint(template_id, collection_id, metadata.name)
                      }
                    ]}
                  />
                ))}
          </Row>
        </Col>
      </CreateNFTWrapper>
    </>
  );
}

export default Templates;
