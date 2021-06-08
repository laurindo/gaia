import { useState, useMemo, useEffect } from 'react';
import { Col, Form, Typography, Row, notification, Spin } from 'antd';
import { useRouter } from 'next/router';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { useMutation } from '@apollo/react-hooks';

import {
  CreateNFTWrapper,
  UploadWrapper,
  CreatorUpload,
  CreatorUploadButton,
  StyledInput,
  StyledTextArea,
  SubmitButton,
  Centralizer,
  NewAttrButton
} from '~/components/profile/styled';
import { uploadFile } from '~/utils/upload';
import Seo from '~/components/seo/seo';
import { CREATE_TEMPLATE } from '~/store/server/mutations';
import useBlockPage from '~/hooks/useBlockPage';
import { URLs } from '~/routes/urls';
import useAuth from '~/hooks/useAuth';

const FormComponent = ({ onSubmit, loading }) => {
  const shouldPageBlock = useBlockPage();
  const [, forceUpdate] = useState({});
  const [form] = Form.useForm();
  const formValues = form.getFieldsValue();

  useEffect(() => {
    shouldPageBlock();
  }, []);

  const disabled = useMemo(() => {
    const { templateName, description, file } = formValues;

    if (!templateName || !description || !file) {
      return true;
    }

    return false;
  }, [formValues]);

  return (
    <Col offset={6} span={12}>
      <Form onBlur={forceUpdate} onFinish={onSubmit} form={form}>
        <UploadWrapper>
          <Typography.Text>Add a template image</Typography.Text>
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
          name="templateName"
          shouldUpdate={false}
          rules={[
            {
              required: true,
              message: 'Please insert a template name'
            }
          ]}
          label="Template Name"
          labelCol={{ span: 24 }}>
          <StyledInput placeholder="Template Name" />
        </Form.Item>
        <Form.Item
          name="description"
          shouldUpdate={false}
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please insert a description'
            }
          ]}
          labelCol={{ span: 24 }}>
          <StyledTextArea name="description" placeholder="Description" multiline />
        </Form.Item>
        <Form.List name="fields">
          {(fields, { add, remove }) => (
            <>
              <Row>
                {fields.map((field, index) => (
                  <>
                    <Col span={10}>
                      <Form.Item
                        {...field}
                        key={`field=${index}`}
                        name={[field.name, 'key']}
                        fieldKey={[field.fieldKey, 'key']}
                        shouldUpdate={false}
                        rules={[
                          {
                            required: true,
                            message: 'Please insert a key name'
                          }
                        ]}>
                        <StyledInput placeholder="Key" />
                      </Form.Item>
                    </Col>
                    <Col span={10} offset={1}>
                      <Form.Item
                        key={`field=${index}`}
                        {...field}
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        shouldUpdate={false}
                        rules={[
                          {
                            required: true,
                            message: 'Please insert a value name'
                          }
                        ]}>
                        <StyledInput placeholder="Value" />
                      </Form.Item>
                    </Col>
                    <Col span={2} offset={1}>
                      <MinusCircleOutlined
                        style={{ fontSize: 24, paddingTop: 10 }}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </>
                ))}
              </Row>
              <Form.Item>
                <Centralizer>
                  <NewAttrButton
                    type="primary"
                    shape="round"
                    onClick={add}
                    block
                    icon={<PlusOutlined />}
                    size="large">
                    Add New Attribute
                  </NewAttrButton>
                </Centralizer>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Centralizer>
          <SubmitButton type="primary" htmlType="submit" shape="round" {...{ disabled, loading }}>
            Create
          </SubmitButton>
        </Centralizer>
      </Form>
    </Col>
  );
};

function CreateTemplate() {
  const router = useRouter();
  const { query } = router;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [createTemplate] = useMutation(CREATE_TEMPLATE);

  async function onSubmit(values) {
    try {
      setLoading(true);
      notification.open({
        key: `create_template_${values.templateName}`,
        message: `Uploading ${values.templateName} image`,
        description: 'Saving image to ipfs',
        icon: <Spin />,
        duration: null
      });
      const ipfsHash = await uploadFile(values.file);

      const metadata = {
        name: values.templateName,
        description: values.description,
        image: ipfsHash
      };

      if (values.fields) {
        values.fields.forEach(field => {
          metadata[field.key] = field.value;
        });
      }
      notification.open({
        key: `create_template_${values.templateName}`,
        message: `Creating ${values.templateName} template`,
        description: 'Sending transaction to the blockchain',
        icon: <Spin />,
        duration: null
      });
      await createTemplate({
        variables: {
          metadata,
          id: Number(query.collectionId),
          recipientAddr: user?.addr
        }
      });
      notification.open({
        key: `create_template_${values.templateName}`,
        type: 'success',
        message: `You have created ${values.templateName} template `,
        description: `Your have successfully created ${values.templateName} template`
      });
      router.push(URLs.templates(query.collectionId));
    } catch (error) {
      notification.open({
        key: `create_template_${values.templateName}`,
        type: 'error',
        message: `Error on create ${values.templateName} template  `,
        description: `Your template creation failed for ${values.templateName}`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateNFTWrapper>
      <Seo title="Create Collection" />
      <Col offset={6} span={12}>
        <Typography.Title>Create New Template</Typography.Title>
      </Col>
      <FormComponent {...{ router, onSubmit, loading }} />
    </CreateNFTWrapper>
  );
}

export default CreateTemplate;
