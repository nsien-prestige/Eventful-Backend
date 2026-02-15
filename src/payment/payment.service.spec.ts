import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from 'src/events/events.entity';
import { Payment, PaymentStatus } from './payment.entity';
import { EventAttendee } from 'src/events/events-entity.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import axios from 'axios';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('axios');

describe('PaymentService', () => {
  let service: PaymentService;

  const mockEventRepo = {
    findOne: jest.fn(),
  };

  const mockPaymentRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAttendeeRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCache = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getRepositoryToken(Event), useValue: mockEventRepo },
        { provide: getRepositoryToken(Payment), useValue: mockPaymentRepo },
        { provide: getRepositoryToken(EventAttendee), useValue: mockAttendeeRepo },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initPayment', () => {
    it('should throw if event not found', async () => {
      mockEventRepo.findOne.mockResolvedValue(null);

      await expect(
        service.initPayment('event1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if already paid', async () => {
      mockEventRepo.findOne.mockResolvedValue({ id: 'event1', price: 100 });
      mockPaymentRepo.findOne.mockResolvedValue({ status: PaymentStatus.SUCCESS });

      await expect(
        service.initPayment('event1', 'user1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should initialize payment successfully', async () => {
      mockEventRepo.findOne.mockResolvedValue({ id: 'event1', price: 100 });
      mockPaymentRepo.findOne.mockResolvedValue(null);

      mockPaymentRepo.create.mockReturnValue({
        user: { id: 'user1', email: 'test@test.com' },
        event: { id: 'event1' },
        amount: 10000,
        reference: 'ref',
      });

      mockPaymentRepo.save.mockResolvedValue({});

      (axios.post as jest.Mock).mockResolvedValue({
        data: { data: { authorization_url: 'url' } },
      });

      const result = await service.initPayment('event1', 'user1');

      expect(result.authorizationUrl).toBe('url');
    });
  });

  describe('verifyPayment', () => {
    it('should throw if payment not found', async () => {
      mockPaymentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.verifyPayment('ref'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return verification result', async () => {
      mockPaymentRepo.findOne.mockResolvedValue({
        status: PaymentStatus.SUCCESS,
      });

      (axios.get as jest.Mock).mockResolvedValue({
        data: { data: { status: 'success' } },
      });

      const result = await service.verifyPayment('ref');

      expect(result.gatewayStatus).toBe('success');
    });
  });

  describe('handlePaystackWebhook', () => {
    it('should throw if signature invalid', () => {
      expect(() =>
        service['verifySignature'](Buffer.from('test'), 'invalid'),
      ).toThrow(UnauthorizedException);
    });
  });
});
