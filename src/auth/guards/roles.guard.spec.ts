import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enums/role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const createMockExecutionContext = (user?: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any);

  beforeEach(() => {
    reflector = mockReflector as any;
    guard = new RolesGuard(reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createMockExecutionContext({ roles: [UserRole.CREATOR] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false if user is not present', () => {
    mockReflector.getAllAndOverride.mockReturnValue([UserRole.CREATOR]);

    const context = createMockExecutionContext(undefined);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return true if user has required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([UserRole.CREATOR]);

    const context = createMockExecutionContext({
      roles: [UserRole.CREATOR],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false if user does not have required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([UserRole.EVENTEE]);

    const context = createMockExecutionContext({
      roles: [UserRole.CREATOR],
    });

    expect(guard.canActivate(context)).toBe(false);
  });
});
