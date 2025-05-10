import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key for public endpoints.
 * Used to mark routes that should be accessible without authentication.
 */
export const IS_PUBLIC_KEY = Symbol('isPublic');

/**
 * Decorator to mark a controller or route as public.
 * Public routes don't require authentication.
 *
 * @example
 * @Public()
 * @Get('profile')
 * getPublicProfile() {
 *   // accessible without authentication
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Helper function to check if a route is marked as public.
 * Simplifies usage in guards and interceptors.
 *
 * @param reflector Reflector instance
 * @param context Execution context (class and handler)
 * @returns true if the route is public
 */
export const isPublic = (reflector: Reflector, context: ExecutionContext): boolean => {
  return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
};
