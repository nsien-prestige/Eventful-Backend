// ✅ Mock crypto BEFORE anything else
jest.mock('crypto', () => ({
  createHmac: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('validhash'),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventAttendee } from 'src/events/events-entity.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('TicketsController', () => {
  let controller: TicketsController;

  const mockAttendeeRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: getRepositoryToken(EventAttendee),
          useValue: mockAttendeeRepo,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================
  // getMyQr
  // =========================
  describe('getMyQr', () => {
    it('should return QR data', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue({
        id: 'att1',
        qrHash: 'hash',
      });

      const req = { user: { userId: 'user1' } };

      const result = await controller.getMyQr(req as any, 'event1');

      expect(result).toEqual({
        attendeeId: 'att1',
        eventId: 'event1',
        qrHash: 'hash',
      });
    });

    it('should throw if ticket not found', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.getMyQr({ user: { userId: '1' } } as any, 'event1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // =========================
  // scanText
  // =========================
  describe('scanText', () => {
    const validHash = 'validhash';

    it('should throw if ticket not found', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.scanText(
          { attendeeId: '1', qrHash: validHash },
          { user: { userId: 'creator1' } } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if not creator', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue({
        id: '1',
        event: { creator: { id: 'creator1' } },
      });

      await expect(
        controller.scanText(
          { attendeeId: '1', qrHash: validHash },
          { user: { userId: 'wrongCreator' } } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw if ticket already used', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue({
        id: '1',
        scannedAt: new Date(),
        event: { creator: { id: 'creator1' } },
      });

      await expect(
        controller.scanText(
          { attendeeId: '1', qrHash: validHash },
          { user: { userId: 'creator1' } } as any,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if QR invalid', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue({
        id: '1',
        scannedAt: null,
        event: { creator: { id: 'creator1' } },
      });

      await expect(
        controller.scanText(
          { attendeeId: '1', qrHash: 'wronghash' },
          { user: { userId: 'creator1' } } as any,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should scan successfully', async () => {
      mockAttendeeRepo.findOne.mockResolvedValue({
        id: '1',
        scannedAt: null,
        user: { username: 'john' },
        event: { creator: { id: 'creator1' } },
      });

      mockAttendeeRepo.save.mockResolvedValue({});

      const result = await controller.scanText(
        { attendeeId: '1', qrHash: validHash },
        { user: { userId: 'creator1' } } as any,
      );

      expect(result.success).toBe(true);
      expect(mockAttendeeRepo.save).toHaveBeenCalled();
    });
  });
});
