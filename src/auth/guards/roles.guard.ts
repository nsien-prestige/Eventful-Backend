import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    );

    if (!requiredRoles) return true

    const req = context.switchToHttp().getRequest()
    const user = req.user

    if (!user) return false

    console.log("Required Roles:", requiredRoles);
    console.log("User Roles:", user.roles);

    return requiredRoles.some(role => user.roles?.includes(role))
  }
}
