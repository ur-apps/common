import { ContextType, Controller, ExecutionContext, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/internal';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { Public, Roles } from 'decorators';
import { RpcForbiddenException } from 'exceptions';

import { RolesGuard } from './roles.guard.ts';

interface User {
  id: number;
  roles: string[];
}

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
class AdminController {
  @Get()
  dashboard() {}

  @Get('status')
  @Public()
  status() {}
}

/**
 * The user sits on the first handler argument, which is the request in `http`, the message data in `rpc` and the client
 * in `ws`.
 */
const createContext = (method: keyof AdminController, user?: User, type: ContextType = 'http'): ExecutionContext => {
  const context = new ExecutionContextHost([{ user }, {}], AdminController, AdminController.prototype[method]);
  context.setType(type);

  return context;
};

describe('Testing guard: RolesGuard', () => {
  describe.each([
    ['created without arguments', () => new RolesGuard()],
    ['created with a Reflector', () => new RolesGuard(new Reflector())],
    [
      'registered by class',
      async () => {
        const moduleRef = await Test.createTestingModule({ controllers: [AdminController] }).compile();

        return moduleRef.get(RolesGuard);
      },
    ],
  ])('when %s', (_, createGuard) => {
    it('allows a public route without a user', async () => {
      const guard = await createGuard();

      expect(guard.canActivate(createContext('status'))).toBe(true);
    });

    it('allows a user with a required role', async () => {
      const guard = await createGuard();

      expect(guard.canActivate(createContext('dashboard', { id: 1, roles: ['admin'] }))).toBe(true);
    });

    it('denies a user without a required role', async () => {
      const guard = await createGuard();

      expect(() => guard.canActivate(createContext('dashboard', { id: 1, roles: ['user'] }))).toThrow(
        ForbiddenException
      );
    });
  });

  describe('in the http context', () => {
    const guard = new RolesGuard();

    it('throws ForbiddenException without a user', () => {
      expect(() => guard.canActivate(createContext('dashboard', undefined, 'http'))).toThrow(ForbiddenException);
    });
  });

  describe('in the rpc context', () => {
    const guard = new RolesGuard();

    it('allows a user from the message data with a required role', () => {
      expect(guard.canActivate(createContext('dashboard', { id: 1, roles: ['admin'] }, 'rpc'))).toBe(true);
    });

    it('throws RpcForbiddenException for a user without a required role', () => {
      expect(() => guard.canActivate(createContext('dashboard', { id: 1, roles: ['user'] }, 'rpc'))).toThrow(
        RpcForbiddenException
      );
    });

    it('throws RpcForbiddenException without a user', () => {
      expect(() => guard.canActivate(createContext('dashboard', undefined, 'rpc'))).toThrow(RpcForbiddenException);
    });
  });

  describe('in the ws context', () => {
    const guard = new RolesGuard();

    it('allows a user from the socket client with a required role', () => {
      expect(guard.canActivate(createContext('dashboard', { id: 1, roles: ['admin'] }, 'ws'))).toBe(true);
    });

    it('returns false for a user without a required role', () => {
      expect(guard.canActivate(createContext('dashboard', { id: 1, roles: ['user'] }, 'ws'))).toBe(false);
    });

    it('returns false without a user', () => {
      expect(guard.canActivate(createContext('dashboard', undefined, 'ws'))).toBe(false);
    });
  });
});
