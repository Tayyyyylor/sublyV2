import {
  createEvent,
  getAllEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
} from '@/services/eventService';
import { TransacType } from '@/types/global';
import axiosInstance from '@/helpers/axiosInstance';

jest.mock('@/helpers/axiosInstance');
const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('eventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createEvent formate les dates et fait un POST', async () => {
    const eventData = {
      name: 'Test Event',
      amount: 100,
      startDate: new Date('2025-06-01'),
      categoryId: 'cat1',
      recurrenceId: 'rec1',
      type: 'EXPENSE' as TransacType,
    };

    const expectedPayload = {
      ...eventData,
      startDate: '2025-06-01T00:00:00.000Z',
      endDate: undefined,
    };

    mockAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const result = await createEvent(eventData);
    expect(mockAxios.post).toHaveBeenCalledWith('/events', expectedPayload);
    expect(result).toEqual({ success: true });
  });

  it('getAllEvent renvoie les événements avec dates converties', async () => {
    const fakeData = [
      {
        id: '1',
        title: 'Event A',
        startDate: '2025-06-01T00:00:00.000Z',
        endDate: '2025-06-05T00:00:00.000Z',
      },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: fakeData });

    const result = await getAllEvent();

    expect(mockAxios.get).toHaveBeenCalledWith('/events');
    expect(result[0].startDate).toBeInstanceOf(Date);
    expect(result[0].endDate).toBeInstanceOf(Date);
  });

  it('getOneEvent renvoie un événement avec dates converties', async () => {
    const eventId = '1';
    const fakeEvent = {
      id: eventId,
      title: 'Single Event',
      startDate: '2025-06-01T00:00:00.000Z',
      endDate: null,
    };

    mockAxios.get.mockResolvedValueOnce({ data: fakeEvent });

    const result = await getOneEvent(eventId);
    expect(mockAxios.get).toHaveBeenCalledWith(`/events/${eventId}`);
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.endDate).toBeUndefined();
  });

  it('updateEvent appelle PATCH avec les bonnes données', async () => {
    const updatedFields = {
      name: 'Updated Event',
      type: 'EXPENSE' as TransacType,
    };

    const expectedResponse = {
      id: '1',
      ...updatedFields,
    };

    mockAxios.patch.mockResolvedValueOnce({ data: expectedResponse });

    const result = await updateEvent('1', updatedFields);

    expect(mockAxios.patch).toHaveBeenCalledWith('/events/1', updatedFields);
    expect(result).toEqual(expectedResponse);
  });

  it('deleteEvent appelle DELETE sur le bon endpoint', async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: { deleted: true } });

    const result = await deleteEvent('1');

    expect(mockAxios.delete).toHaveBeenCalledWith('/events/1');
    expect(result).toEqual({ deleted: true });
  });
});
