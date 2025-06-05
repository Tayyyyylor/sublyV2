import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useAuth, SessionProvider } from '@/context/useAuth';

jest.mock('expo-secure-store');
jest.mock('jwt-decode');

const fakeToken = 'fake.jwt.token';

const createWrapper = (children: React.ReactNode) => (
  <SessionProvider>{children}</SessionProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load a valid token from SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(fakeToken);
    (jwtDecode as jest.Mock)
      .mockReturnValueOnce({ exp: Date.now() / 1000 + 3600 }) // pour validité
      .mockReturnValueOnce({ username: 'John', sub: '123' }); // pour user

    let contextValue: ReturnType<typeof useAuth> = {} as any;

    const TestComponent = () => {
      contextValue = useAuth();
      return null;
    };

    render(createWrapper(<TestComponent />));

    await waitFor(() => {
      expect(contextValue.session).toBe(fakeToken);
      expect(contextValue.user).toEqual({ username: 'John', id: '123' });
      expect(contextValue.isLoading).toBe(false);
    });
  });

  it('should delete an expired token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(fakeToken);
    (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 - 10 }); // expiré

    let contextValue: ReturnType<typeof useAuth> = {} as any;

    const TestComponent = () => {
      contextValue = useAuth();
      return null;
    };

    render(createWrapper(<TestComponent />));

    await waitFor(() => {
      expect(contextValue.session).toBe(null);
      expect(contextValue.user).toBe(null);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('session');
    });
  });

  it('should store and update the token', async () => {
    (jwtDecode as jest.Mock).mockReturnValue({ username: 'John', sub: '123' });

    let contextValue: ReturnType<typeof useAuth> = {} as any;

    const TestComponent = () => {
      contextValue = useAuth();
      return null;
    };

    render(createWrapper(<TestComponent />));

    await waitFor(() => expect(contextValue.isLoading).toBe(false));

    await contextValue.signIn(fakeToken);

    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'session',
        fakeToken,
      );
      expect(contextValue.session).toBe(fakeToken);
      expect(contextValue.user).toEqual({ username: 'John', id: '123' });
    });
  });

  it('should delete the token', async () => {
    (jwtDecode as jest.Mock).mockReturnValue({ username: 'John', sub: '123' });

    let contextValue: ReturnType<typeof useAuth> = {} as any;

    const TestComponent = () => {
      contextValue = useAuth();
      return null;
    };

    render(createWrapper(<TestComponent />));

    await waitFor(() => expect(contextValue.isLoading).toBe(false));

    await contextValue.signIn(fakeToken);
    await contextValue.signOut();

    await waitFor(() => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('session');
      expect(contextValue.session).toBe(null);
      expect(contextValue.user).toBe(null);
    });
  });
});
