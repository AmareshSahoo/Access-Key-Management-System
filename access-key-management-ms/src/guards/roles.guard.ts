// src/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RolesEnum } from '../decorators/roles.decorator';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<RolesEnum[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log("=======", user, requiredRoles);

    const userRoles: RolesEnum[] = user.role === RolesEnum.ADMIN || user.isAdmin ? [RolesEnum.ADMIN] : user.role ;

    console.log("userRoles", userRoles);

    if(!userRoles){
      return false;
    }

    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    return hasRequiredRole;
  }
}
