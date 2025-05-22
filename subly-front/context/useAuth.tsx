import {
  useContext,
  createContext,
  type PropsWithChildren,
  useMemo,
  useState,
  useEffect,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  username: string;
  id: string;
}

const TOKEN_KEY = 'session';

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  user?: UserData | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  user: null,
  isLoading: true,
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
  const [session, setSessionState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log('storedToken', storedToken);
      if (storedToken) {
        try {
          const decoded = jwtDecode<{ exp: number }>(storedToken);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            console.warn('Token expiré');
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setSessionState(null);
          } else {
            setSessionState(storedToken);
          }
        } catch (error) {
          console.error('Erreur JWT :', error);
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setSessionState(null);
        }
      }

      setIsLoading(false);
    };

    loadToken();
  }, []);

  const signIn = async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setSessionState(token);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setSessionState(null);
  };

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

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
