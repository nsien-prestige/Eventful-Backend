import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    creatorOverview: jest.fn(),
    eventAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOverview', () => {
    it('should call service with logged-in user id', async () => {
      const req = { user: { userId: 'creator-123' } };

      mockAnalyticsService.creatorOverview.mockResolvedValue({
        totalEvents: 2,
      });

      const result = await controller.createOverview(req);

      expect(service.creatorOverview).toHaveBeenCalledWith('creator-123');
      expect(result).toEqual({ totalEvents: 2 });
    });
  });

  describe('eventAnalytics', () => {
    it('should call service with eventId and userId', async () => {
      const req = { user: { userId: 'creator-123' } };

      mockAnalyticsService.eventAnalytics.mockResolvedValue({
        eventId: 'event-1',
      });

      const result = await controller.eventAnalytics('event-1', req);

      expect(service.eventAnalytics).toHaveBeenCalledWith(
        'event-1',
        'creator-123',
      );

      expect(result).toEqual({ eventId: 'event-1' });
    });
  });
});
