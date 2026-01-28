import EventService from '../../services/event.service';
import Event from '../../models/event.model';

jest.mock('../../models/event.model');

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    eventService = new EventService();
    jest.clearAllMocks();
  });

  it('should create an event', async () => {
    const mockData = { name: 'Test Event' };
    const mockSaved = { _id: '123', ...mockData };

    const mockSave = jest.fn().mockResolvedValue(mockSaved);
    (Event as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await eventService.createEvent(mockData as any);
    expect(result).toEqual(mockSaved);
  });
});
