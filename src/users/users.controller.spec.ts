import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the authenticated user', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'john',
      };

      const req = { user: mockUser };

      const result = controller.getProfile(req as any);

      expect(result).toEqual(mockUser);
    });
  });
});
