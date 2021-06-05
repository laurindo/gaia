import { Card, Skeleton } from 'antd';
import styled from 'styled-components';

const CardStyled = styled(Card)`
  border-width: 1px;
  border-color: #e5e8eb;
  border-radius: 8px;
  width: 184px;
  height: ${({ title }) => (title ? '300px' : '259px')};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  & .ant-card-head {
    padding: 0 6px;
    min-height: unset;
    & .ant-card-head-wrapper .ant-card-head-title {
      padding: 8px 0;
    }
  }
  & .ant-card-cover img {
    height: 182px;
  }
  & .ant-card-body {
    margin: 7px 8px 10px 9px;
    padding: 0;
    flex: 1;
    & div {
      display: flex;
      justify-content: space-between;
      & span {
        font-size: 10px;
        color: #838689;
      }
      & p {
        font-size: 10px;
        flex-basis: 90%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  margin-bottom: ${props => (props.skeleton ? '20px' : '0')};
  margin-left: ${props => (props.skeleton ? '10px' : '0')};
  margin-right: ${props => (props.skeleton ? '10px' : '0')};
`;

export const CardTitleContainer = styled.div`
  height: 35px;
`;

export const CardTitle = styled.p`
  white-space: normal;
`;

export const CardBottomOptions = styled.div`
  width: 100%;
  justify-content: flex-end;
`;

export const CardBottomText = styled.span`
  font-weight: 700;
  color: #404040;
`;
export const PlaceholderSkeletonImg = styled(Skeleton.Avatar)`
  &&& {
    width: 100%;
    height: 182px;
  }
`;

export const PlaceholderSkeleton = styled(Skeleton)`
  &&& {
    width: 100%;
    .ant-skeleton-title {
      margin-top: 0;
    }
    .ant-skeleton-paragraph {
      width: 100%;
      margin-bottom: 0;
      & > li + li {
        margin-top: 4px;
      }
    }
  }
`;

export default CardStyled;
