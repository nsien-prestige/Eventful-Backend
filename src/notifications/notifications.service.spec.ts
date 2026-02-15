import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockNotificationRepo = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockSendMail = jest.fn();

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepo,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scheduleReminders', () => {
    it('should save notification', async () => {
      mockNotificationRepo.save.mockResolvedValue({ id: '1' });

      const event = { id: 'event1', title: 'Test Event' } as any;
      const when = new Date();

      const result = await service.scheduleReminders(
        'user1',
        event,
        when,
      );

      expect(mockNotificationRepo.save).toHaveBeenCalledWith({
        user: { id: 'user1' },
        event,
        type: 'EVENT_REMINDER',
        scheduledFor: when,
      });

      expect(result).toEqual({ id: '1' });
    });
  });

  describe('sendScheduledNotifications', () => {
    it('should send emails and mark notifications as sent', async () => {
      const notification = {
        id: '1',
        sent: false,
        user: { email: 'test@test.com' },
        event: { title: 'Event Title' },
      };

      mockNotificationRepo.find.mockResolvedValue([notification]);
      mockNotificationRepo.save.mockResolvedValue({});

      await service.sendScheduledNotifications();

      expect(mockNotificationRepo.find).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledWith({
        to: 'test@test.com',
        subject: 'Reminder: Event Title',
        text: 'Your event Event Title is coming up soon.',
      });

      expect(notification.sent).toBe(true);
      expect(mockNotificationRepo.save).toHaveBeenCalledWith(notification);
    });

    it('should do nothing if no notifications found', async () => {
      mockNotificationRepo.find.mockResolvedValue([]);

      await service.sendScheduledNotifications();

      expect(mockSendMail).not.toHaveBeenCalled();
    });
  });
});
