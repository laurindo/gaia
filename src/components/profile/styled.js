import styled from 'styled-components';
import { Button, Upload, Row, Input } from 'antd';

export const StyledProfileInput = styled(Input)`
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 10px;
`;

export const StyledProfileTextArea = styled(Input)`
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 10px;
`;

export const Heading = styled.p`
  font-size: 30px;
  line-height: 32px;
  font-weight: 700;
  margin: 0 0 10px;
`;

export const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.brightBlue};
  width: ${({ width }) => width ?? 'auto'};
`;

export const StyledUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
    height: 300px;
    border-radius: 8px;
  }
`;

export const Label = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 20px 0 10px;
`;

export const MarketPlaceWrapper = styled(Row)`
  padding-top: 20px;

  .token-card {
    margin-bottom: 20px;
    margin-right: 20px;
  }
`;

export const ProfileWrapper = styled(Row)`
  .token-card,
  .drop-down {
    margin-bottom: 20px;
  }

  .token-card {
    margin-right: 20px;
  }

  .address {
    margin: -22.5px auto 10px;
  }
`;

export const HomeWrapper = styled(Row)`
  .token-card {
    margin-right: 22px;
  }
`;

export const UploadWrapper = styled.div`
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e8eb;
  border-radius: 10px;
  height: 194px;
`;

export const CreatorUpload = styled(Upload)`
  .ant-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const CreatorUploadButton = styled(Button)`
  margin-top: 10px;
`;

export const NewAttrButton = styled(CreatorUploadButton)`
  width: 90%;
`;

export const StyledInput = styled(Input)`
  border: 1px solid #e5e8eb;
  padding: 10px 20px;
  border-radius: 10px;
`;

export const StyledTextArea = styled(Input.TextArea)`
  border: 1px solid #e5e8eb;
  padding: 10px 20px;
  border-radius: 10px;
  height: 239px;
  resize: none;
`;

export const SubmitButton = styled(Button)`
  width: 90%;
  height: 48px;
`;

export const Centralizer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const CreateNFTWrapper = styled(Row)`
  margin: 30px auto;

  .token-card {
    margin: 0 20px 20px 0;
  }
`;

export const Banner = styled.div`
  width: 100%;
  height: 165px;
  background-image: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center;
`;

export const ImagePreview = styled.img`
  width: 270px;
  height: 270px;
  object-fit: cover;
`;
