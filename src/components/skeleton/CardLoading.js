import { Col, Skeleton, Space } from 'antd';
import CardStyled, {
  PlaceholderSkeleton,
  PlaceholderSkeletonImg
} from '~/components/shared/CardStyled';
import React from 'react';

export const CardLoading = ({ key, hasTopBar }) => {
  return (
    <Col>
      <CardStyled
        skeleton
        className="token-card"
        title={
          hasTopBar && (
            <Col span={24}>
              <Skeleton.Avatar shape="circle" active size={20} />
            </Col>
          )
        }
        cover={<PlaceholderSkeletonImg shape="square" active />}
        hoverable
        key={key}>
        <Space direction="vertical">
          <PlaceholderSkeleton paragraph={false} title={{ width: '40%' }} active />

          <PlaceholderSkeleton paragraph={{ rows: 2 }} title={false} active />
        </Space>
      </CardStyled>
    </Col>
  );
};
