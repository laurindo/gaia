import { Menu, Row, Modal, notification, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setupAccount } from '~/flow/setupAccount';
import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';
import { URLs } from '~/routes/urls';
import { ColStyled } from '~/components/header/styled';

function UserMenuContent({ loggedIn }) {
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const { initialized, hasSetup } = useProfile(user?.addr);
  const router = useRouter();

  const handleGoToEditProfile = async () => {
    const initializedProfile = await initialized();
    const initializedAccount = await hasSetup();
    console.warn(initializedProfile, initializedAccount);
    if (initializedProfile && initializedAccount) {
      router.push(URLs.editProfile);
    } else {
      setModalVisible(true);
    }
  };

  const handleInitializeProfile = async () => {
    try {
      setModalVisible(false);
      notification.open({
        key: `setup_account`,
        icon: <Spin />,
        message: `Setting up your account`,
        description: 'You gonna be prompted to accept this transaction',
        duration: null
      });
      await setupAccount();
      notification.open({
        key: `setup_account`,
        type: 'success',
        message: `You have set up your account`,
        description: `Your have successfully set up your account`
      });
      router.push(URLs.editProfile);
    } catch (err) {
      notification.open({
        key: `setup_account`,
        type: 'error',
        message: `Error on setup your account`,
        description: `Your account setup failed, please try again later.`
      });
    }
  };
  return loggedIn ? (
    <>
      <Row>
        <ColStyled span={24}>
          <Menu>
            <Menu.Item onClick={() => handleGoToEditProfile()}>Edit Profile</Menu.Item>
            <Menu.Item onClick={logout}>Logout</Menu.Item>
          </Menu>
        </ColStyled>
      </Row>
      <Modal
        visible={modalVisible}
        title="You need to initialize your profile before editing it"
        onOk={handleInitializeProfile}
        onCancel={() => setModalVisible(false)}
        onRefuse={() => setModalVisible(false)}>
        <p>Would you like to initialize it?</p>
      </Modal>
    </>
  ) : null;
}

export default UserMenuContent;
