import { useContext } from 'react';

import { AuthContext } from '~/providers/AuthProvider';

export default () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useBlockPage must be within an AuthProvider');
  }

  return context.shouldPageBlock;
};
