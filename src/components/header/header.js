import { useEffect, useState } from 'react';
import { Row, Col, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Search from '~/components/header/search';
import UserMenu from '~/components/header/UserMenu';

import useAuth from '~/hooks/useAuth';

import { URLs } from '~/routes/urls';
import { appName } from '~/config/config';

import { MenuCol, CustomHeader, JustifyCenter } from './styled';

function MyHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState('');

  const getCurrentKey = () => {
    const routes = [
      URLs.marketplace,
      `/profile/${user?.addr || '[id]'}`,
      `/explorer`,
      URLs.editProfile,
      URLs.create,
      URLs.root
    ];
    let whichRoute = routes.filter(route => router.asPath.includes(route))[0];
    if (whichRoute === routes[1] || whichRoute === routes[2]) return setCurrentRoute('inventory');
    if (whichRoute === routes[5]) return setCurrentRoute(URLs.root);
    if (whichRoute === routes[3]) return setCurrentRoute('login');
    setCurrentRoute(whichRoute);
  };
  useEffect(getCurrentKey, [router.pathname]);

  return (
    <CustomHeader>
      <Row justify="space-between" align="middle" gutter={[20, 0]}>
        <Col>
          <Link href={URLs.home}>
            <a href="about:blank">{appName}</a>
          </Link>
        </Col>
        <Col flex="auto">
          <JustifyCenter>
            <Search />
          </JustifyCenter>
        </Col>
        <MenuCol>
          <Menu mode="horizontal" selectedKeys={currentRoute}>
            <Menu.Item key="/">
              <Link href={URLs.home}>
                <a href="about:blank">Home</a>
              </Link>
            </Menu.Item>
            <Menu.Item key={URLs.marketplace}>
              <Link href={URLs.marketplace}>
                <a href="about:blank">Marketplace</a>
              </Link>
            </Menu.Item>
            {user?.loggedIn && (
              <Menu.Item key="inventory">
                <Link href={URLs.profile(user?.addr)}>
                  <a href="about:blank">Inventory</a>
                </Link>
              </Menu.Item>
            )}
            <Menu.Item key={URLs.create}>
              <Link href={URLs.create}>
                <a href="about:blank">Create NFT</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Space align="baseline">
                <UserMenu />
              </Space>
            </Menu.Item>
          </Menu>
        </MenuCol>
      </Row>
    </CustomHeader>
  );
}

export default MyHeader;
