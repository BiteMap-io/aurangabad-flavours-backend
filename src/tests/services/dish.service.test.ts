import DishService from '../../services/dish.service';
import Dish from '../../models/dish.model';

jest.mock('../../models/dish.model');

describe('DishService', () => {
  let dishService: DishService;

  beforeEach(() => {
    dishService = new DishService();
    jest.clearAllMocks();
  });

  it('should create a dish', async () => {
    const mockData = { name: 'Test Dish' };
    const mockSaved = { _id: '123', ...mockData };

    const mockSave = jest.fn().mockResolvedValue(mockSaved);
    (Dish as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await dishService.createDish(mockData as any);
    expect(result).toEqual(mockSaved);
  });
});
