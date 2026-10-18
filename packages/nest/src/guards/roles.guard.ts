import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { HttpMessage } from 'constants/';
import { getRoles, hasRequiredRoles, isPublic } from 'decorators';
import { RpcForbiddenException } from 'exceptions';

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
  private readonly logger = new Logger(RolesGuard.name);

  constructor(@Optional() private reflector: Reflector = new Reflector()) {}

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
      return this.deny(context);
    }

    // Get user roles (with fallback to empty array)
    const userRoles = user.roles || [];

    // Check if user has at least one of required roles
    if (!hasRequiredRoles(requiredRoles, userRoles)) {
      this.logger.warn(
        `User ${user.id} is not allowed to access [${context.getClass().name}] (${context.getHandler().name})`
      );

      return this.deny(context);
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

  /**
   * Denies access in the way the current context expects: throws `RpcForbiddenException` in `rpc`,
   * returns `false` in `ws` and leaves the denial to Nest, throws `ForbiddenException` elsewhere.
   */
  private deny(context: ExecutionContext): false {
    switch (context.getType()) {
      case 'rpc':
        throw new RpcForbiddenException();
      case 'ws':
        return false;
      default:
        throw new ForbiddenException(HttpMessage.FORBIDDEN);
    }
  }
}
