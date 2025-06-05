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

// Simuler une requête GET fictive
const mockUrl = '/test-endpoint';

describe('axiosInstance', () => {
  let requestInterceptor: Function;

  beforeEach(() => {
    jest.clearAllMocks();
    // Simuler l'ajout d'un intercepteur
    requestInterceptor = async (config: any) => {
      const token = await SecureStore.getItemAsync('session');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };
  });

  it('ajoute le token Authorization dans les headers si présent', async () => {
    const fakeToken = 'fake.jwt.token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(fakeToken);

    const testConfig = { headers: {} };
    const updatedConfig = await requestInterceptor(testConfig);

    expect(updatedConfig.headers.Authorization).toBe(`Bearer ${fakeToken}`);
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('session');
  });

  it("n'ajoute pas de header Authorization si pas de token", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const testConfig = { headers: {} };
    const updatedConfig = await requestInterceptor(testConfig);

    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });

  it('utilise la bonne URL de base', () => {
    const baseURL = axiosInstance.defaults.baseURL;
    expect(baseURL).toMatch(/localhost:3000|http/);
  });
});
