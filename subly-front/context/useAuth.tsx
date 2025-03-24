import {
  useContext,
  createContext,
  type PropsWithChildren,
  useMemo,
} from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  username: string;
  id: string;
}

const AuthContext = createContext<{
  signIn: (token: string, username: string) => void;
  signOut: () => void;
  session?: string | null;
  user?: UserData | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const user = useMemo(() => {
    if (!session) return null;
    try {
      const decoded = jwtDecode<{ username: string; sub: string }>(session);
      return { username: decoded.username, id: decoded.sub };
    } catch (error) {
      console.error('Erreur de décodage du JWT:', error);
      return null;
    }
  }, [session]);

  console.log('user', user);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string, username: string) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
