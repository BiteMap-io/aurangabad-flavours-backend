import UserService from '../../services/user.service';
import User from '../../models/user.model';

jest.mock('../../models/user.model');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const mockData = { name: 'Test User', email: 'test@example.com' };
    const mockSaved = { _id: '123', ...mockData };

    const mockSave = jest.fn().mockResolvedValue(mockSaved);
    (User as unknown as jest.Mock).mockImplementation(() => ({
      save: mockSave,
    }));

    const result = await userService.createUser(mockData as any);
    expect(result).toEqual(mockSaved);
  });
});
