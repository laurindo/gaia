import { Menu, Row, Modal, notification, Spin, Input, Form, Col, Button } from 'antd';
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
  const [formData, setFormData] = useState({});
  // console.log(formData, "formData")
  const { user, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalFlow, setOpenModalFlow] = useState(false);
  const { initialized, hasSetup } = useProfile(user?.addr);
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

  const handleOpenModalFlowUsd = () => {
    setOpenModalFlow(true);
  };
  const [fusdFaucet] = useMutation(FUSD_FAUCET);

  async function hendleFaucet() {
    try {
      await fusdFaucet({
        variables: {
          receiver: formData.address,
          amount: formData.amount
        }
      });
    } catch (err) {
      // console.log(err, "ERRRR");
    }
  }
  hendleFaucet();
  function handleSubmitFormFlow(value) {
    setFormData(value);
    // console.log(value)
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
        onOk={() => setOpenModalFlow(false)}
        onCancel={() => setOpenModalFlow(false)}
        onRefuse={() => setOpenModalFlow(false)}>
        <Form form={form} onFinish={handleSubmitFormFlow}>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Row>
              <Col span={12}>
                <Input placeholder="input your address" />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Row>
              <Col span={3}>
                <Input placeholder="input your amount" />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  ) : null;
}

export default UserMenuContent;
