import PropTypes from 'prop-types';
import { Modal } from 'antd';

import useAuth from '~/hooks/useAuth';

const AuthModal = ({ visible, onDismiss }) => {
  const { login } = useAuth();

  const handleCancel = () => {
    onDismiss();
  };

  const handleLogin = () => {
    onDismiss();
    login();
  };

  return (
    <Modal onOk={handleLogin} onCancel={handleCancel} {...{ visible }}>
      <p>In order to access this page, you must first authenticate</p>
    </Modal>
  );
};

AuthModal.propTypes = {
  visible: PropTypes.bool.isRequired
};

export default AuthModal;
