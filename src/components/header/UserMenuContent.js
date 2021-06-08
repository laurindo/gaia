import { Menu, Row, Modal, notification, Spin, Input, InputNumber, Form, Col } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setupAccount } from '~/flow/setupAccount';
import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';
import { URLs } from '~/routes/urls';
import { ColStyled } from '~/components/header/styled';
import { useMutation } from '@apollo/react-hooks';
import { FUSD_FAUCET } from '~/store/server/mutations';

function UserMenuContent({ loggedIn }) {
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    receiver: '',
    amount: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalFlow, setOpenModalFlow] = useState(false);
  const { initialized, hasSetup } = useProfile(user?.addr);
  const [FUSDfaucet] = useMutation(FUSD_FAUCET);
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

  async function hendleFaucet() {
    try {
      notification.open({
        key: `faucet_usd`,
        icon: <Spin />,
        message: `Setting up your account`,
        description: 'Please wait while we process your request.',
        duration: null
      });
      await FUSDfaucet({
        variables: {
          receiver: formData.receiver,
          amount: formData.amount
        }
      });
      notification.open({
        key: `faucet_usd`,
        type: 'success',
        message: `You have created template `,
        description: `Your have successfully transaction to the blockchain`
      });
    } catch (err) {
      notification.open({
        key: `faucet_usd`,
        type: 'error',
        message: `Error on setup your account`,
        description: `Your account setup failed, please try again later.`
      });
    } finally {
      setOpenModalFlow(false);
    }
  }

  function handleInputChange(value) {
    setFormData({ receiver: user?.addr, amount: value });
  }
  function handleSubmitFormFlow() {
    hendleFaucet();
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
        visible={openModalFlow}
        width="800px"
        onOk={handleSubmitFormFlow}
        onCancel={() => setOpenModalFlow(false)}
        onRefuse={() => setOpenModalFlow(false)}>
        <Form form={form}>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Row>
              <Col span={12}>
                <Input readOnly={true} defaultValue={user?.addr} placeholder="input your address" />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Row>
              <Col span={6}>
                <InputNumber
                  min={1}
                  max={50}
                  onChange={handleInputChange}
                  maxLength="2"
                  placeholder="input your amount"
                />
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  ) : null;
}

export default UserMenuContent;
