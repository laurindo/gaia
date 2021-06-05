import styled from 'styled-components';
import { Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const CheckIcon = styled(CheckOutlined)`
  font-size: 45px;
  margin-left: 6px;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  flex: 1;
`;

export const Content = styled.div`
  flex: 4;
`;

export const Title = styled.p`
  font-weight: 700;
  font-size: 25px;
  margin: 0;
`;

export const Description = styled(Typography.Text)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.lightGray};
`;
