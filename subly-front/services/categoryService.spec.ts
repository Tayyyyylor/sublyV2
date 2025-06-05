import { getAllCategories } from '@/services/categoryService';
import axiosInstance from '@/helpers/axiosInstance';

jest.mock('@/helpers/axiosInstance');
const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('récupère les catégories avec succès', async () => {
    const fakeCategories = [
      { id: 1, name: 'Logement' },
      { id: 2, name: 'Transport' },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: fakeCategories });

    const result = await getAllCategories();

    expect(mockAxios.get).toHaveBeenCalledWith('/categories');
    expect(result).toEqual(fakeCategories);
  });

  it('lève une erreur si la récupération échoue', async () => {
    const fakeError = new Error('API KO');
    mockAxios.get.mockRejectedValueOnce(fakeError);

    await expect(getAllCategories()).rejects.toThrow('API KO');
    expect(mockAxios.get).toHaveBeenCalledWith('/categories');
  });
});
