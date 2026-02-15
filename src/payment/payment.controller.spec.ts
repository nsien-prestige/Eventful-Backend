import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    initPayment: jest.fn(),
    verifyPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should initialize payment', async () => {
    const dto = { eventId: 'event1' };
    const req = { user: { userId: 'user1' } };

    mockPaymentService.initPayment.mockResolvedValue({
      authorizationUrl: 'url',
      reference: 'ref',
    });

    const result = await controller.initPayment(dto as any, req);

    expect(service.initPayment).toHaveBeenCalledWith('event1', 'user1');
    expect(result.reference).toBe('ref');
  });

  it('should verify payment', async () => {
    mockPaymentService.verifyPayment.mockResolvedValue({
      paymentStatus: 'SUCCESS',
      gatewayStatus: 'success',
    });

    const result = await controller.verifyPayment('ref');

    expect(service.verifyPayment).toHaveBeenCalledWith('ref');
    expect(result.gatewayStatus).toBe('success');
  });
});
