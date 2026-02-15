import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    create: jest.fn(),
    attendEvent: jest.fn(),
    findByCreator: jest.fn(),
    findAll: jest.fn(),
    getAttendees: jest.fn(),
    findByPublicId: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create event', async () => {
    const dto = { title: 'Test', date: new Date() };
    const req = { user: { userId: '1' } };

    mockEventsService.create.mockResolvedValue({ event: {}, token: null });

    const result = await controller.createEvent(dto as any, req);

    expect(service.create).toHaveBeenCalledWith(dto, '1');
    expect(result).toEqual({ event: {}, token: null });
  });

  it('should attend event', async () => {
    const req = { user: { userId: '1' } };
    mockEventsService.attendEvent.mockResolvedValue({});

    await controller.attendEvent('eventId', req);

    expect(service.attendEvent).toHaveBeenCalledWith('eventId', '1');
  });

  it('should get creator events', async () => {
    const req = { user: { userId: '1' } };
    mockEventsService.findByCreator.mockResolvedValue([]);

    await controller.getEvents(req);

    expect(service.findByCreator).toHaveBeenCalledWith('1');
  });

  it('should get all events', async () => {
    mockEventsService.findAll.mockResolvedValue([]);

    await controller.getAllEvents({});

    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get attendees', async () => {
    const req = { user: { userId: '1' } };

    await controller.getEventAttendees('eventId', req);

    expect(service.getAttendees).toHaveBeenCalledWith('eventId', '1');
  });

  it('should get event by publicId', async () => {
    await controller.getEventByPublicId('publicId');

    expect(service.findByPublicId).toHaveBeenCalledWith('publicId');
  });

  it('should delete event', async () => {
    const req = { user: { userId: '1' } };

    await controller.deleteEvent('eventId', req);

    expect(service.delete).toHaveBeenCalledWith('eventId', '1');
  });
});
