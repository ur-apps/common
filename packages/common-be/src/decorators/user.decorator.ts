import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { pick } from '@ur-apps/common';

/**
 * Extracts user or user properties from the request context
 * @param property Optional: property name or array of property names to extract
 * @example
 * // Extract full user object
 * @User() user: UserEntity
 *
 * // Extract only user id
 * @User('id') userId: string
 *
 * // Extract only specified user properties
 * @User(['id', 'roles']) userInfo: Pick<UserEntity, 'id' | 'roles'>
 */
export const User = createParamDecorator((property: string | string[] | undefined, ctx: ExecutionContext) => {
  let user;

  switch (ctx.getType()) {
    case 'http':
      user = ctx.switchToHttp().getRequest().user;
      break;
    case 'rpc':
      user = ctx.switchToRpc().getData().user;
      break;
    case 'ws':
      user = ctx.switchToWs().getClient().user;
      break;
    default:
      user = null;
  }

  if (!user) return null;

  // Return specific property
  if (typeof property === 'string') {
    return user[property];
  }

  // Return selected properties
  if (Array.isArray(property)) {
    return pick(user, property);
  }

  // Return full user object
  return user;
});
