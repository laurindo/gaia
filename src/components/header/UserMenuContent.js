import { Menu, Row, Modal, notification, Spin, InputNumber, Form } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setupAccount } from '~/flow/setupAccount';
import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';
import useBalance from '~/hooks/useBalance';
import { URLs } from '~/routes/urls';
import { ColStyled } from '~/components/header/styled';
import { useMutation } from '@apollo/react-hooks';
import { FUSD_FAUCET } from '~/store/server/mutations';
import { getFUSDBalance } from '~/flow/getFusdBalance';

function UserMenuContent({ loggedIn }) {
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalFlow, setOpenModalFlow] = useState(false);
  const { initialized, hasSetup } = useProfile(user?.addr);
  const [FUSDfaucet] = useMutation(FUSD_FAUCET);
  const { updateUser } = useBalance();
  const router = useRouter();

  const handleGoToEditProfile = async () => {
    const initializedProfile = await initialized();
    const initializedAccount = await hasSetup();
    if (initializedProfile && initializedAccount) {
      router.push(URLs.editProfile);
    } else {
      setModalVisible(true);
    }
  };

  const handleOpenModalFlowUsd = async () => {
    const initializedProfile = await initialized();
    const initializedAccount = await hasSetup();
    if (initializedProfile && initializedAccount) {
      setOpenModalFlow(true);
    } else {
      setModalVisible(true);
    }
  };

  async function handleFaucet(values) {
    try {
      setOpenModalFlow(false);

      notification.open({
        key: `faucet_usd`,
        icon: <Spin />,
        message: `Adding FUSD to your account`,
        description: 'Please wait while we process your request.',
        duration: null
      });

      await FUSDfaucet({
        variables: {
          receiver: user?.addr,
          amount: values.amount
        }
      });

      await getFUSDBalance(user?.addr);
      updateUser();

      notification.open({
        key: `faucet_usd`,
        type: 'success',
        message: `FUSD added succesfully `,
        description: ``
      });
    } catch (err) {
      notification.open({
        key: `faucet_usd`,
        type: 'error',
        message: `Error to add FUSD to your account`,
        description: `Something has failed, please try again later.`
      });
    }
  }

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
            <Menu.Item onClick={handleOpenModalFlowUsd}>Flow USD</Menu.Item>
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

      <Modal
        title="How many FUSD do you want?"
        visible={openModalFlow}
        width="500px"
        onOk={() => form.submit()}
        okText="Claim FUSD"
        onCancel={() => setOpenModalFlow(false)}
        onRefuse={() => setOpenModalFlow(false)}>
        <Form form={form} onFinish={handleFaucet} initialValues={{ amount: 10 }}>
          <Form.Item label="Address" name="address">
            <span>{user?.addr}</span>
          </Form.Item>

          <Form.Item label="Amount" name="amount">
            <InputNumber name="amount" min={1} max={50} placeholder="Ex: 5" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  ) : null;
}

export default UserMenuContent;
