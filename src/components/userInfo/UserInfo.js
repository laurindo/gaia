import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { Wrapper, Info, Role } from './styled';

const UserInfo = ({ src, name, type }) => {
  const avatarSource = src ? { src } : { icon: <UserOutlined /> };
  return (
    <Wrapper>
      <Avatar size="large" {...avatarSource} />
      <div>
        <Info>{name}</Info>
        <Role>{type}</Role>
      </div>
    </Wrapper>
  );
};

UserInfo.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  src: PropTypes.string
};

UserInfo.defaultProps = {
  src: undefined
};

export default UserInfo;
