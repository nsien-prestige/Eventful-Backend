import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from 'src/events/events.entity';
import { Payment, PaymentStatus } from 'src/payment/payment.entity';
import { EventAttendee } from 'src/events/events-entity.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockEventRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPaymentRepo = {
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAttendeeRepo = {
    count: jest.fn(),
  };

  const mockCache = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: getRepositoryToken(Event), useValue: mockEventRepo },
        { provide: getRepositoryToken(Payment), useValue: mockPaymentRepo },
        { provide: getRepositoryToken(EventAttendee), useValue: mockAttendeeRepo },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creatorOverview', () => {
    it('should return zeros if no events', async () => {
      mockEventRepo.find.mockResolvedValue([]);
      const result = await service.creatorOverview('creator1');
      expect(result).toEqual({
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        totalAttendees: 0,
      });
    });

    it('should return correct overview', async () => {
      const events = [{ id: 'e1' }, { id: 'e2' }];
      const payments = [
        { amount: 100 },
        { amount: 200 },
      ];

      mockEventRepo.find.mockResolvedValue(events);
      mockPaymentRepo.find.mockResolvedValue(payments);
      mockAttendeeRepo.count.mockResolvedValue(5);

      const result = await service.creatorOverview('creator1');

      expect(result).toEqual({
        totalEvents: 2,
        totalTicketsSold: 2,
        totalRevenue: 300,
        totalAttendees: 5,
      });
    });
  });

  describe('eventAnalytics', () => {
    it('should throw NotFoundException if event not found', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(service.eventAnalytics('e1', 'creator1')).rejects.toThrow('Event not found');
    });

    it('should throw ForbiddenException if creator mismatch', async () => {
      mockEventRepo.findOne.mockResolvedValue({ id: 'e1', creator: { id: 'other' } });

      await expect(service.eventAnalytics('e1', 'creator1')).rejects.toThrow('Not your event');
    });

    it('should return correct analytics data', async () => {
      mockEventRepo.findOne.mockResolvedValue({ id: 'e1', creator: { id: 'creator1' } });

      mockPaymentRepo.count.mockImplementation(({ where: { status } }) => {
        return status === PaymentStatus.SUCCESS ? 3 : 1;
      });

      const mockQB = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ sum: '600' }),
      };
      mockPaymentRepo.createQueryBuilder.mockReturnValue(mockQB as any);

      mockAttendeeRepo.count.mockImplementation(({ where }) => {
        if (where.scannedAt !== undefined) return 2;
        return 4;
      });

      const result = await service.eventAnalytics('e1', 'creator1');

      expect(result).toEqual({
        eventId: 'e1',
        ticketsSold: 3,
        successfulPayments: 3,
        failedPayments: 1,
        revenue: 600,
        attendees: 4,
        scannedCount: 2,
      });
    });
  });
});
