import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { EventAttendee } from './events-entity.entity';
import { User } from 'src/users/users.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventStatus } from './events.entity';
import { UserRole } from 'src/auth/enums/role.enum';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    increment: jest.fn(),
    delete: jest.fn(),
  };

  const mockAttendeeRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockNotificationsService = {
    scheduleReminders: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getRepositoryToken(Event), useValue: mockEventRepo },
        { provide: getRepositoryToken(EventAttendee), useValue: mockAttendeeRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ date: new Date() } as any, '1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should auto-promote and issue token', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        roles: [UserRole.EVENTEE],
      };

      mockUserRepo.findOne.mockResolvedValue(user);
      mockUserRepo.save.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('newToken');

      mockEventRepo.create.mockReturnValue({ id: 'event1', date: new Date() });
      mockEventRepo.save.mockResolvedValue({ id: 'event1', date: new Date() });

      const result = await service.create(
        { date: new Date() } as any,
        '1',
      );

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result.token).toBe('newToken');
    });
  });

  describe('findAll', () => {
    it('should return cached events', async () => {
      mockCache.get.mockResolvedValue(['cached']);

      const result = await service.findAll();

      expect(result).toEqual(['cached']);
    });

    it('should fetch and cache if not cached', async () => {
      mockCache.get.mockResolvedValue(null);
      mockEventRepo.find.mockResolvedValue(['db']);

      const result = await service.findAll();

      expect(mockCache.set).toHaveBeenCalled();
      expect(result).toEqual(['db']);
    });
  });

  describe('attendEvent', () => {
    it('should throw if event not found', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(
        service.attendEvent('event1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if event is closed', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        id: 'event1',
        status: EventStatus.CLOSED,
      });

      await expect(
        service.attendEvent('event1', 'user1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getAttendees', () => {
    it('should throw if not creator', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        id: 'event1',
        creator: { id: 'creator1' },
      });

      await expect(
        service.getAttendees('event1', 'wrongUser'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should throw if not creator', async () => {
      mockEventRepo.findOne.mockResolvedValue({
        id: 'event1',
        creator: { id: 'creator1' },
      });

      await expect(
        service.delete('event1', 'wrongUser'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
