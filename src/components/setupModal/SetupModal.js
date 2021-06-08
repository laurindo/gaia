import PropTypes from 'prop-types';
import { Modal, Spin, notification } from 'antd';

import { setupAccount } from '~/flow/setupAccount';

import styles from './styles';

const SetupModal = ({ visible, onDismiss }) => {
  const handleSetup = async () => {
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
    onDismiss();
  };

  return (
    <Modal
      okText="I agree"
      onOk={handleSetup}
      cancelButtonProps={{ style: styles.cancelButton }}
      closable={false}
      {...{ visible }}>
      <p>You must first agree on setting up your account</p>
    </Modal>
  );
};

SetupModal.propTypes = {
  visible: PropTypes.bool.isRequired
};

export default SetupModal;
