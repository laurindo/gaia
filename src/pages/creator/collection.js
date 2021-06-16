import { useState, useMemo } from 'react';
import { Col, Form, Typography, Row, Spin, notification } from 'antd';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';

import {
  CreateNFTWrapper,
  StyledInput,
  SubmitButton,
  Centralizer,
  StyledTextArea,
  CreatorUpload,
  CreatorUploadButton,
  UploadWrapper
} from '~/components/profile/styled';
import useAuth from '~/hooks/useAuth';
import Seo from '~/components/seo/seo';
import { CREATE_SET } from '~/store/server/mutations';
import { URLs } from '~/routes/urls';
import { uploadFile } from '~/utils/upload';

const FormComponent = ({ onSubmit, loading }) => {
  const [, forceUpdate] = useState({});
  const [form] = Form.useForm();
  const formValues = form.getFieldsValue();

  const disabled = useMemo(() => {
    const { collectionName, fee, file, description } = formValues;

    if (
      [collectionName, fee, file, description].some(item => item == false || item === undefined)
    ) {
      return true;
    }

    return false;
  }, [formValues]);

  return (
    <Col offset={6} span={12}>
      <Form onBlur={forceUpdate} onFinish={onSubmit} form={form}>
        <UploadWrapper>
          <Typography.Text>Add a collection image</Typography.Text>
          <Form.Item name="file" trigger={null} shouldUpdate={false}>
            <CreatorUpload
              customRequest={async ({ file, onSuccess }) => {
                form.setFieldsValue({ file });
                onSuccess();
              }}
              onRemove={() => {
                form.setFieldsValue({ file: null });
              }}
              maxCount={1}
              accept=".png,.gif,.webp,.jpeg,.jpg">
              <CreatorUploadButton type="primary" shape="round">
                Choose file
              </CreatorUploadButton>
            </CreatorUpload>
          </Form.Item>
        </UploadWrapper>
        <Form.Item
          wrapperCol={{ span: 24 }}
          name="collectionName"
          shouldUpdate={false}
          label="Collection Name"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              min: 3,
              message: 'Collection Name must be minimum 3 characters'
            }
          ]}>
          <StyledInput placeholder="Collection Name" />
        </Form.Item>
        <Row>
          <Col span={19}>
            <Form.Item
              name="description"
              shouldUpdate={false}
              label="Description"
              rules={[
                {
                  required: true,
                  min: 3,
                  message: 'Description must be minimum  3 characters'
                }
              ]}
              labelCol={{ span: 24 }}>
              <StyledTextArea name="description" placeholder="Description" multiline />
            </Form.Item>
          </Col>
          <Col offset={1} span={4}>
            <Form.Item
              name="fee"
              shouldUpdate={false}
              rules={[
                {
                  required: true,
                  message: 'Please insert a market fee'
                }
              ]}
              label="Market Fee (max: 15%)"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              <StyledInput min={1} max={15} placeholder="Market Fee" type="number" />
            </Form.Item>
          </Col>
        </Row>
        {formValues.fee && <p>* You will make for {100 - formValues.fee}% every secondary sale</p>}

        <Centralizer>
          <SubmitButton type="primary" htmlType="submit" shape="round" {...{ disabled, loading }}>
            Create
          </SubmitButton>
        </Centralizer>
      </Form>
    </Col>
  );
};

function CreateNFT() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createSet] = useMutation(CREATE_SET);

  async function onSubmit(values) {
    const { collectionName, fee, description, file } = values;
    const marketFee = Number(fee) === 0 ? Number(fee).toFixed(2) : fee / 100;
    try {
      setLoading(true);
      notification.open({
        key: `create_collection_${collectionName}`,
        icon: <Spin />,
        message: `Creating collection ${collectionName}`,
        description: 'Sending transaction to the blockchain',
        duration: null
      });
      const ipfsHash = await uploadFile(file);
      await createSet({
        variables: {
          name: collectionName,
          description: description,
          image: ipfsHash,
          website: 'siteURL',
          creator: user?.addr,
          marketFee: marketFee
        }
      });
      notification.open({
        key: `create_collection_${collectionName}`,
        type: 'success',
        message: `You have created ${collectionName} collection `,
        description: `Your have successfully created ${collectionName} collection which market fee is ${fee}`
      });
      router.push(URLs.create);
    } catch (error) {
      console.error(error);
      notification.open({
        key: `create_collection_${collectionName}`,
        type: 'error',
        message: `Error on create ${collectionName} collection  `,
        description: `Your collection creation failed for ${collectionName}`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateNFTWrapper>
      <Seo title="Create Collection" />
      <Col offset={6} span={12}>
        <Typography.Title>Create New Collection</Typography.Title>
      </Col>
      <FormComponent {...{ router, onSubmit, loading }} />
    </CreateNFTWrapper>
  );
}

export default CreateNFT;

// Missing description and image
