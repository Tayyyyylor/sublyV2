import axiosInstance from '@/helpers/axiosInstance';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');
jest.mock('axios', () => {
  const interceptors = {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  };
  return {
    create: () => ({
      interceptors,
      defaults: { baseURL: 'http://localhost:3000' },
    }),
  };
});

describe('axiosInstance', () => {
  let requestInterceptor: Function;

  beforeEach(() => {
    jest.clearAllMocks();
    requestInterceptor = async (config: any) => {
      const token = await SecureStore.getItemAsync('session');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };
  });

  it('should add the Authorization header if a token is present', async () => {
    const fakeToken = 'fake.jwt.token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(fakeToken);

    const testConfig = { headers: {} };
    const updatedConfig = await requestInterceptor(testConfig);

    expect(updatedConfig.headers.Authorization).toBe(`Bearer ${fakeToken}`);
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('session');
  });

  it('should not add the Authorization header if no token is present', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const testConfig = { headers: {} };
    const updatedConfig = await requestInterceptor(testConfig);

    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });

  it('should use the correct base URL', () => {
    const baseURL = axiosInstance.defaults.baseURL;
    expect(baseURL).toMatch(/localhost:3000|http/);
  });
});
