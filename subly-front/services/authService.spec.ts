import {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
} from '@/services/authService';
import axiosInstance from '@/helpers/axiosInstance';
import { router } from 'expo-router';

jest.mock('@/helpers/axiosInstance');
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registerUser envoie une requête POST et retourne les données', async () => {
    const userData = { username: 'john', password: 'test' };
    mockAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await registerUser(userData);
    expect(mockAxios.post).toHaveBeenCalledWith('/users', userData);
    expect(result).toEqual({ success: true });
  });

  it('deleteUser envoie une requête DELETE', async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: { deleted: true } });

    const result = await deleteUser('123');
    expect(mockAxios.delete).toHaveBeenCalledWith('/users/123');
    expect(result).toEqual({ deleted: true });
  });

  it('loginUser appelle signIn avec le token et redirige', async () => {
    const userData = { email: 'test@test.com', password: '123456' };
    const mockSignIn = jest.fn();
    const fakeToken = 'abc.def.ghi';

    mockAxios.post.mockResolvedValueOnce({
      data: { access_token: fakeToken },
    });

    await loginUser(userData, mockSignIn);

    expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', userData);
    expect(mockSignIn).toHaveBeenCalledWith(fakeToken);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('logoutUser appelle signOut et redirige', async () => {
    const mockSignOut = jest.fn();

    await logoutUser(mockSignOut);

    expect(mockSignOut).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/signin');
  });

  it('loginUser lève une erreur si le token est manquant', async () => {
    const userData = { email: 'test@test.com', password: '123456' };
    const mockSignIn = jest.fn();

    mockAxios.post.mockResolvedValueOnce({ data: {} }); // pas de token

    await expect(loginUser(userData, mockSignIn)).rejects.toThrow(
      'Token manquant dans la réponse API',
    );
  });
});
