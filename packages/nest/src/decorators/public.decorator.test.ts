import { Controller, ExecutionContext, Get, SetMetadata, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/internal';
import { describe, expect, it } from 'vitest';

import { isPublic, Public } from './public.decorator.ts';

@Controller('public')
@Public()
class PublicController {
  @Get()
  find() {}
}

@Controller('mixed')
class MixedController {
  @Get('public')
  @Public()
  publicRoute() {}

  @Get('private')
  privateRoute() {}

  @Get('foreign')
  @SetMetadata(Symbol('isPublic'), true)
  foreignPublicRoute() {}
}

const reflector = new Reflector();

const createContext = <T>(controller: Type<T>, method: keyof T): ExecutionContext =>
  new ExecutionContextHost([], controller, controller.prototype[method]);

describe('Testing decorator: @Public()', () => {
  it('marks a route as public', () => {
    expect(isPublic(reflector, createContext(MixedController, 'publicRoute'))).toBe(true);
  });

  it('marks every route of a controller as public', () => {
    expect(isPublic(reflector, createContext(PublicController, 'find'))).toBe(true);
  });

  it('returns false for an unmarked route', () => {
    expect(isPublic(reflector, createContext(MixedController, 'privateRoute'))).toBe(false);
  });

  it('does not see @Public() from another copy of the package', () => {
    expect(isPublic(reflector, createContext(MixedController, 'foreignPublicRoute'))).toBe(false);
  });
});
