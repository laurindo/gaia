import styled from 'styled-components';
import { Button, Upload, Typography } from 'antd';
const { Text } = Typography;

export const UploadComponent = styled(Upload)`
  .ant-upload {
    border-radius: 10px;
    font-size: 11px;
    &.ant-upload-select-picture-card {
      background-color: transparent;
    }
    min-width: 200px;
  }
  .ant-upload-select {
    height: 80%;
  }
`;

export const UploadContent = styled.div`
  position: relative;
  margin: 1px;
`;

export const UploadControllers = styled.div`
  padding: 7rem 4rem;
  position: relative;
  z-index: 0;
`;

export const UploadPreview = styled.img`
  width: 80%;
  height: 100%;
  object-fit: contain;
`;

export const UploadPreviewContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 20;
`;

export const UploadClearButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  font-size: 2rem;
`;

export const Price = styled(Text)`
  font-weight: 700;
  margin-left: 5px;
`;

export const PriceContainer = styled.div`
  display: flex;
`;
