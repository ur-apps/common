import { Controller, ExecutionContext, Get, SetMetadata, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/internal';
import { describe, expect, it } from 'vitest';

import { getRoles, hasRequiredRoles, Roles } from './roles.decorator.ts';

@Controller('admin')
@Roles('admin')
class AdminController {
  @Get()
  dashboard() {}

  @Get('reports')
  @Roles('analyst', 'auditor')
  reports() {}
}

@Controller('open')
class OpenController {
  @Get()
  find() {}

  @Get('moderation')
  @Roles('moderator')
  moderation() {}

  @Get('foreign')
  @SetMetadata(Symbol('roles'), ['admin'])
  foreignRestrictedRoute() {}
}

const reflector = new Reflector();

const createContext = <T>(controller: Type<T>, method: keyof T): ExecutionContext =>
  new ExecutionContextHost([], controller, controller.prototype[method]);

describe('Testing decorator: @Roles()', () => {
  describe('getRoles', () => {
    it('returns the roles of a route', () => {
      expect(getRoles(reflector, createContext(OpenController, 'moderation'))).toEqual(['moderator']);
    });

    it('returns the roles of the controller for its routes', () => {
      expect(getRoles(reflector, createContext(AdminController, 'dashboard'))).toEqual(['admin']);
    });

    it('prefers the roles of a route over the roles of its controller', () => {
      expect(getRoles(reflector, createContext(AdminController, 'reports'))).toEqual(['analyst', 'auditor']);
    });

    it('returns an empty array for an unmarked route', () => {
      expect(getRoles(reflector, createContext(OpenController, 'find'))).toEqual([]);
    });

    it('does not see @Roles() from another copy of the package', () => {
      expect(getRoles(reflector, createContext(OpenController, 'foreignRestrictedRoute'))).toEqual([]);
    });
  });

  describe('hasRequiredRoles', () => {
    it('allows any user when no roles are required', () => {
      expect(hasRequiredRoles([], [])).toBe(true);
    });

    it('allows a user with at least one of the required roles', () => {
      expect(hasRequiredRoles(['admin', 'moderator'], ['user', 'moderator'])).toBe(true);
    });

    it('denies a user without any of the required roles', () => {
      expect(hasRequiredRoles(['admin'], ['user'])).toBe(false);
    });
  });
});
