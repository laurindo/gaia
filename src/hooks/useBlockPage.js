import { useContext } from 'react';

import { AuthContext } from '~/providers/AuthProvider';

export default () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useBlockPage must be within a AuthProvider');
  }

  return context;
};
