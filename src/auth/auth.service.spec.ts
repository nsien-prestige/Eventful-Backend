import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/role.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: '1' });

      await expect(
        service.signup({ email: 'test@test.com', password: '123' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      mockUsersService.create.mockReturnValue({
        id: '1',
        email: 'test@test.com',
        roles: [UserRole.EVENTEE],
      });

      mockUsersService.save.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        roles: [UserRole.EVENTEE],
      });

      mockJwtService.sign.mockReturnValue('token');

      const result = await service.signup({
        email: 'test@test.com',
        password: '123',
      } as any);

      expect(mockUsersService.save).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.login({ email: 'a', password: 'b' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password mismatch', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        id: '1',
        password: 'hashed',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'a', password: 'b' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return token if login successful', async () => {
      mockUsersService.findByEmailWithPassword.mockResolvedValue({
        id: '1',
        email: 'a',
        password: 'hashed',
        roles: [UserRole.EVENTEE],
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login({
        email: 'a',
        password: 'b',
      } as any);

      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('generateToken', () => {
    it('should sign and return JWT', () => {
      mockJwtService.sign.mockReturnValue('token');

      const result = service.generateToken({
        id: '1',
        email: 'test@test.com',
        roles: [UserRole.EVENTEE],
      } as any);

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toBe('token');
    });
  });
});
