import { Controller, ExecutionContext, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/internal';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { Public, Roles } from 'decorators';

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

const createContext = (method: keyof AdminController, user?: User): ExecutionContext =>
  new ExecutionContextHost([{ user }, {}], AdminController, AdminController.prototype[method]);

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
});
