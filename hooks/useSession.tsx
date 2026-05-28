import { useState, useEffect, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

type Session = { fullname: string; username: string } | null;

interface SessionContextType {
  session: Session;
  isLoading: boolean;
  signIn: (user: Session) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const userStr = await SecureStore.getItemAsync('user');
      if (userStr) setSession(JSON.parse(userStr));
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (user: Session) => {
    if (user) {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      setSession(user);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('user');
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};
