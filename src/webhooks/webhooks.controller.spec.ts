import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { PaymentService } from 'src/payment/payment.service';

describe('WebhooksController', () => {
  let controller: WebhooksController;

  const mockPaymentService = {
    handlePaystackWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handlePaystackWebhook', () => {
    it('should call paymentService with correct arguments', async () => {
      const mockPayload = { event: 'charge.success' };
      const mockSignature = 'signature123';
      const mockRawBody = Buffer.from('raw-body');

      const mockReq = {
        rawBody: mockRawBody,
      };

      const mockResponse = { received: true };

      mockPaymentService.handlePaystackWebhook.mockResolvedValue(mockResponse);

      const result = await controller.handlePaystackWebhook(
        mockReq as any,
        mockPayload,
        mockSignature,
      );

      expect(mockPaymentService.handlePaystackWebhook).toHaveBeenCalledWith(
        mockPayload,
        mockSignature,
        mockRawBody,
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
