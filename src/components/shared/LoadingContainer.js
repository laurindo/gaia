import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingContainer = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const LoadingIcon = styled(LoadingOutlined)`
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
