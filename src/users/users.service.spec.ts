import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create', () => {
      const data = { email: 'test@mail.com' };

      service.create(data);

      expect(mockUserRepo.create).toHaveBeenCalledWith(data);
    });
  });

  describe('save', () => {
    it('should call repository.save', async () => {
      const user = { id: '1' };

      await service.save(user as any);

      expect(mockUserRepo.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: '1', email: 'test@mail.com' };

      mockUserRepo.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@mail.com');

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@mail.com' },
      });

      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = { id: '1' };

      mockUserRepo.findOne.mockResolvedValue(user);

      const result = await service.findById('1');

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });

      expect(result).toEqual(user);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return user with password using query builder', async () => {
      const mockUser = { id: '1', email: 'test@mail.com', password: 'hashed' };

      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockUserRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByEmailWithPassword('test@mail.com');

      expect(mockUserRepo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        { email: 'test@mail.com' },
      );

      expect(result).toEqual(mockUser);
    });
  });
});
