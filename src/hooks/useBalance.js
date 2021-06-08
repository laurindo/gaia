import { useContext } from 'react';

import { AuthContext } from '~/providers/AuthProvider';

export default () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useBalance must be within an AuthProvider');
  }

  return {
    updateUser: context.updateUser,
    flowBalance: context.flowBalance,
    fusdBalance: context.fusdBalance
  };
};
