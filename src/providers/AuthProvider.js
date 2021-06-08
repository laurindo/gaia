import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import AuthModal from '~/components/authModal/AuthModal';
import SetupModal from '~/components/setupModal/SetupModal';

import useAuth from '~/hooks/useAuth';
import useProfile from '~/hooks/useProfile';

import { URLs } from '~/routes/urls';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { hasSetup } = useProfile(user?.addr);

  const shouldPageBlock = useCallback(() => {
    if (!user?.addr) {
      router.push(URLs.home);
      setAuthModalVisible(true);
    }
  }, [user, authModalVisible]);

  useEffect(() => {
    if (user?.addr) {
      setAuthModalVisible(false);
    }
  }, [user]);

  useEffect(async () => {
    const initializedAccount = await hasSetup();

    if (user?.addr && !initializedAccount) {
      setSetupModalVisible(true);
    }
  }, [user, hasSetup]);

  const flowBalance = useMemo(() => user?.balance, [user]);

  const fusdBalance = useMemo(() => user?.usd_balance, [user]);

  return (
    <AuthContext.Provider value={{ shouldPageBlock, updateUser, flowBalance, fusdBalance }}>
      {children}
      <AuthModal onDismiss={() => setAuthModalVisible(false)} visible={authModalVisible} />
      <SetupModal onDismiss={() => setSetupModalVisible(false)} visible={setupModalVisible} />
    </AuthContext.Provider>
  );
};
