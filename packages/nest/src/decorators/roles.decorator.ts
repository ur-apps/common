import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key for role-based access control.
 * Used to mark routes that should be accessible only to users with specific roles.
 */
export const ROLES_KEY = Symbol('roles');

/**
 * Decorator to mark a controller or route as requiring specific user roles.
 * Only users with at least one of the specified roles will be able to access the route.
 *
 * @param roles Array of role names required for access
 * @example
 * @Roles('admin', 'moderator')
 * @Get('dashboard')
 * getDashboard() {
 *   // only accessible to users with 'admin' or 'moderator' role
 * }
 *
 * // With enum type
 * enum UserRole { ADMIN = 'admin', MODERATOR = 'moderator' }
 * @Roles<UserRole>(UserRole.ADMIN, UserRole.MODERATOR)
 * @Get('dashboard')
 * getAdminDashboard() {
 *   // only accessible to users with admin or moderator role
 * }
 */
export const Roles = <T extends string = string>(...roles: T[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Helper function to retrieve roles required for a route.
 * Simplifies usage in guards and interceptors.
 *
 * @param reflector Reflector instance
 * @param context Execution context (class and handler)
 * @returns Array of required roles or empty array if no roles specified
 */
export const getRoles = <T extends string = string>(reflector: Reflector, context: ExecutionContext): T[] => {
  return reflector.getAllAndOverride<T[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) || [];
};

/**
 * Helper function to check if a user with given roles has access to a route.
 *
 * @param requiredRoles Roles required for the route
 * @param userRoles Roles that the user has
 * @returns true if user has at least one of the required roles
 */
export const hasRequiredRoles = <T extends string = string>(requiredRoles: T[], userRoles: T[]): boolean => {
  if (!requiredRoles.length) return true;

  return requiredRoles.some((role) => userRoles.includes(role));
};
