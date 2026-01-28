import FoodTrailService from '../../services/foodTrail.service';
import FoodTrail from '../../models/foodTrail.model';

jest.mock('../../models/foodTrail.model');

describe('FoodTrailService', () => {
  let service: FoodTrailService;

  beforeEach(() => {
    service = new FoodTrailService();
    jest.clearAllMocks();
  });

  it('should create a food trail', async () => {
    const mockData = { name: 'Test Trail' };
    const mockSaved = { _id: '123', ...mockData };

    const mockSave = jest.fn().mockResolvedValue(mockSaved);
    (FoodTrail as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await service.createFoodTrail(mockData as any);
    expect(result).toEqual(mockSaved);
  });
});
