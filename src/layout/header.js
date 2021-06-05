import { useEffect, useState } from 'react';
import { Typography, Row, Col, Menu, Dropdown, Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import Link from 'next/link';

import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';
import { URLs } from '~/routes/urls';

import {
  SearchCol,
  SearchInput,
  SearchButton,
  Header as LayoutHeader,
  UserCol,
  UserButton,
  UserName
} from './styles';
import { getImageURL } from '~/utils/getImageUrl';
import { UserOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { setupAccount } from '~/flow/setupAccount';
import { appName } from '~/config/config';

function Header() {
  const [currentRoute, setCurrentRoute] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { user, login, logout } = useAuth();
  const { initialized, initProfile, userProfile } = useProfile(user?.addr);
  const router = useRouter();

  const getCurrentKey = () => {
    const routes = [URLs.marketplace, URLs.profile(user?.addr), URLs.create, URLs.home];
    setCurrentRoute(routes.filter(item => router.asPath.includes(item))[0] || '');
  };

  const handleGoToEditProfile = async () => {
    if (await initialized) {
      router.push(URLs.editProfile);
    } else {
      setModalVisible(true);
    }
  };

  const handleInitializeProfile = async () => {
    setModalVisible(false);
    await initProfile();
    await setupAccount();
    router.push(URLs.editProfile);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" onClick={handleGoToEditProfile}>
          Edit Profile
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" onClick={async () => setupAccount()}>
          Setup Account
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" danger onClick={logout}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  useEffect(getCurrentKey, [router.pathname]);

  const NavigationMenu = () => (
    <Menu
      onClick={e => e.key != 'login' && router.push(e.key)}
      selectedKeys={[currentRoute]}
      mode="horizontal"
      inlineCollapsed={false}
      forceSubMenuRender={true}
      overflowedIndicator={() => false}>
      <Menu.Item key="/">Home</Menu.Item>
      <Menu.Item key="/market">Marketplace</Menu.Item>
      {user?.loggedIn && <Menu.Item key={`/profile/${user?.addr}`}>Inventory</Menu.Item>}
      {user?.loggedIn && <Menu.Item key="/creator">Create NFT</Menu.Item>}
      <Menu.Item className="user-button-height" key="login" disabled>
        {user?.loggedIn ? (
          <Dropdown overlay={menu} placement="topLeft">
            <UserButton>
              <UserName>{userProfile?.name || user?.addr}</UserName>
              <Avatar
                size={30}
                icon={<UserOutlined />}
                src={userProfile?.avatar && getImageURL(userProfile?.avatar)}
              />
            </UserButton>
          </Dropdown>
        ) : (
          <UserButton onClick={login}>
            <UserName>Login</UserName>
          </UserButton>
        )}
      </Menu.Item>
    </Menu>
  );

  return (
    <LayoutHeader>
      <Row justify="space-between" align="middle" gutter={[20, 0]}>
        <Col span={3} xxl={8}>
          <Link href="/">
            <Typography.Text>{appName}</Typography.Text>
          </Link>
        </Col>
        <SearchCol span={6} xxl={8}>
          <SearchInput
            size="large"
            suffix={
              <SearchButton>
                <SearchOutlined />
              </SearchButton>
            }
            placeholder="Search items"
          />
        </SearchCol>
        <UserCol span={15} xxl={8}>
          <NavigationMenu />
        </UserCol>
      </Row>
      <Modal
        visible={modalVisible}
        title="You need to initialize your profile before editing it"
        onOk={handleInitializeProfile}
        onCancel={() => setModalVisible(false)}
        onRefuse={() => setModalVisible(false)}>
        <p>Would you like to initialize it?</p>
      </Modal>
    </LayoutHeader>
  );
}

export default Header;
