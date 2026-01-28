import RestaurantService from '../../services/restaurant.service';
import Restaurant from '../../models/restaurant.model';

jest.mock('../../models/restaurant.model');

describe('RestaurantService', () => {
  let service: RestaurantService;

  beforeEach(() => {
    service = new RestaurantService();
    jest.clearAllMocks();
  });

  it('should create a restaurant', async () => {
    const mockData = { name: 'Test Rest' };
    const mockSaved = { _id: '123', ...mockData };

    const mockSave = jest.fn().mockResolvedValue(mockSaved);
    (Restaurant as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await service.createRestaurant(mockData as any);
    expect(result).toEqual(mockSaved);
  });
});
