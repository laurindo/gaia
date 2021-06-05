import { Button, Space, Typography } from 'antd';
import React from 'react';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import {
  UploadComponent,
  UploadContent,
  UploadControllers,
  UploadPreview,
  UploadPreviewContainer
} from './styled';
import { getImageURL } from '../../utils/getImageUrl';
const { Text } = Typography;

const ACCEPTED_FILE_EXTENSIONS = '.png, .gif, .webp, .mp4, .mp3, .jpg';

function FileUploader({ contentTitle, customRequest, image, disabled }) {
  const coverImage = image ? getImageURL(image) : null;
  return (
    <UploadComponent
      listType="picture-card"
      accept={ACCEPTED_FILE_EXTENSIONS}
      showUploadList={false}
      customRequest={customRequest}
      maxCount={1}
      multiple={false}
      disabled={disabled}>
      <UploadContent>
        <UploadPreviewContainer>
          {coverImage ? <UploadPreview alt="preview" src={coverImage} /> : null}
        </UploadPreviewContainer>
        <UploadControllers>
          <Space direction="vertical">
            <Text>
              <PlusOutlined />
              {contentTitle}
            </Text>
            <Button type="primary" shape="round">
              Choose a file
            </Button>
          </Space>
        </UploadControllers>
      </UploadContent>
    </UploadComponent>
  );
}

export default FileUploader;
