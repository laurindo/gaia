import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover } from 'antd';
import React from 'react';

import UserMenuContent from '~/components/header/UserMenuContent';

import useBalance from '~/hooks/useBalance';
import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';
import { getImageURL } from '~/utils/getImageUrl';

import { UserContainerCenter, UserAvatarContainer, UserInfo, UserBalance } from './styled';

function UserMenu() {
  const { user, login } = useAuth();
  const { userProfile } = useProfile(user?.addr);
  const { flowBalance, fusdBalance } = useBalance();

  return user?.loggedIn ? (
    <Popover
      content={<UserMenuContent loggedIn={user?.loggedIn} />}
      trigger="hover"
      placement="bottomRight">
      <UserContainerCenter>
        <UserContainerCenter $wrap>
          <UserInfo>{userProfile?.name ?? user?.addr}</UserInfo>
          <UserInfo small> {flowBalance} FLOW</UserInfo>
          <UserBalance small>{fusdBalance} FUSD</UserBalance>
        </UserContainerCenter>
        <UserAvatarContainer>
          <Avatar
            icon={<UserOutlined />}
            src={userProfile?.avatar && getImageURL(userProfile?.avatar)}
          />
        </UserAvatarContainer>
      </UserContainerCenter>
    </Popover>
  ) : (
    <Button type="link" onClick={login}>
      Login
    </Button>
  );
}

export default UserMenu;
