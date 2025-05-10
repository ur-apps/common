import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HttpMessage } from 'constants/';
import { getRoles, hasRequiredRoles, isPublic } from 'decorators';

/**
 * Guard for role-based access control to routes
 * Works in conjunction with @Roles() and @Public() decorators
 *
 * @example
 * // Global registration
 * app.useGlobalGuards(new RolesGuard());
 *
 * // Provider registration
 * @Module({
 *   providers: [
 *     {
 *       provide: APP_GUARD,
 *       useClass: RolesGuard,
 *     },
 *   ],
 * })
 * export class AppModule {}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    if (isPublic(this.reflector, context)) {
      return true;
    }

    // Get required roles from handler and class metadata
    const requiredRoles = getRoles(this.reflector, context);

    // If no roles specified, allow access
    if (!requiredRoles.length) {
      return true;
    }

    // Get user from request
    const user = this.getUserFromContext(context);

    // If no user, deny access
    if (!user) {
      throw new ForbiddenException(HttpMessage.FORBIDDEN);
    }

    // Get user roles (with fallback to empty array)
    const userRoles = user.roles || [];

    // Check if user has at least one of required roles
    if (!hasRequiredRoles(requiredRoles, userRoles)) {
      throw new ForbiddenException(HttpMessage.FORBIDDEN);
    }

    return true;
  }

  private getUserFromContext(context: ExecutionContext) {
    switch (context.getType()) {
      case 'http':
        return context.switchToHttp().getRequest().user;
      case 'rpc':
        return context.switchToRpc().getData().user;
      case 'ws':
        return context.switchToWs().getClient().user;
      default:
        return null;
    }
  }
}
