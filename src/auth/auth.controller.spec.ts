import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'test@test.com', password: '123456' };

      mockAuthService.login.mockResolvedValue({
        access_token: 'token',
      });

      const result = await controller.login(dto as any);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('signup', () => {
    it('should call authService.signup', async () => {
      const dto = { email: 'test@test.com', password: '123456' };

      mockAuthService.signup.mockResolvedValue({
        access_token: 'token',
      });

      const result = await controller.signup(dto as any);

      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
