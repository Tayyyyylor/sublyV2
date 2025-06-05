import { getAllRecurrences } from '@/services/recurrenceService';
import axiosInstance from '@/helpers/axiosInstance';

jest.mock('@/helpers/axiosInstance');
const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('recurrenceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère les récurrences avec succès', async () => {
    const fakeRecurrences = [
      { id: 1, frequency: 'DAILY' },
      { id: 2, frequency: 'MONTHLY' },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: fakeRecurrences });

    const result = await getAllRecurrences();

    expect(mockAxios.get).toHaveBeenCalledWith('/recurrences');
    expect(result).toEqual(fakeRecurrences);
  });

  it('lève une erreur si la récupération échoue', async () => {
    const error = new Error('API indisponible');
    mockAxios.get.mockRejectedValueOnce(error);

    await expect(getAllRecurrences()).rejects.toThrow('API indisponible');
    expect(mockAxios.get).toHaveBeenCalledWith('/recurrences');
  });
});
