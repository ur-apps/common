import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { CallHandler, ContextType, Controller, Get, Sse, StreamableFile, Type, UseInterceptors } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/internal';
import { Test } from '@nestjs/testing';
import { defer, isObservable, lastValueFrom, of, toArray } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { SuccessResponseDTO } from 'dtos';

import { TransformInterceptor } from './transform.interceptor.ts';

type Handler = (response: ServerResponse) => unknown;

interface InterceptOptions {
  type?: ContextType;
  contentType?: string;
}

const pdf = Buffer.from('%PDF-1.7');

@Controller('files')
class FilesController {
  @Get('data')
  data() {
    return { id: 1 };
  }

  @Get('dto')
  dto() {
    return new SuccessResponseDTO({ id: 1 });
  }

  @Get('empty')
  empty() {}

  @Get('file')
  file() {
    return new StreamableFile(Buffer.from('data'));
  }

  @Sse('events')
  events() {
    return of({ data: 'ping' }, { data: 'pong' });
  }

  @Get('pdf')
  pdf() {
    return pdf;
  }

  @Get('generated-pdf')
  generatedPdf(response: ServerResponse) {
    response.setHeader('Content-Type', 'application/pdf');

    return pdf;
  }
}

@Controller('class-registered')
@UseInterceptors(TransformInterceptor)
class ClassRegisteredController {}

/**
 * Runs a controller method through the interceptor. The method is invoked only when the observable
 * returned by `next.handle()` is subscribed to.
 */
function intercept<T>(
  interceptor: TransformInterceptor,
  controller: Type<T>,
  method: keyof T,
  { type = 'http', contentType }: InterceptOptions = {}
) {
  const request = new IncomingMessage(new Socket());
  const response = new ServerResponse(request);

  if (contentType) {
    response.setHeader('Content-Type', contentType);
  }

  const instance = new controller();
  const handler = instance[method] as Handler;
  const context = new ExecutionContextHost(type === 'http' ? [request, response] : [{}, {}], controller, handler);
  context.setType(type);

  const next: CallHandler = {
    handle: () =>
      defer(() => {
        const result = handler.call(instance, response);

        return isObservable(result) ? result : of(result);
      }),
  };

  return interceptor.intercept(context, next);
}

describe('Testing interceptor: TransformInterceptor', () => {
  describe('registration', () => {
    it('fails to compile a module that registers it by class with @UseInterceptors()', async () => {
      const compiling = Test.createTestingModule({ controllers: [ClassRegisteredController] }).compile();

      await expect(compiling).rejects.toThrow(/can't resolve dependencies of the TransformInterceptor/);
    });

    it('fails to compile a module that registers it by class as APP_INTERCEPTOR', async () => {
      const compiling = Test.createTestingModule({
        providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
      }).compile();

      await expect(compiling).rejects.toThrow(/can't resolve dependencies of the TransformInterceptor/);
    });
  });

  describe('response wrapping', () => {
    it('wraps handler data in SuccessResponseDTO', async () => {
      const result = await lastValueFrom(intercept(new TransformInterceptor(), FilesController, 'data'));

      expect(result).toStrictEqual(new SuccessResponseDTO({ id: 1 }));
    });

    it('passes a SuccessResponseDTO through unchanged', async () => {
      const result = await lastValueFrom(intercept(new TransformInterceptor(), FilesController, 'dto'));

      expect(result).toStrictEqual(new SuccessResponseDTO({ id: 1 }));
    });

    it('turns an undefined result into { success: true }', async () => {
      const result = await lastValueFrom(intercept(new TransformInterceptor(), FilesController, 'empty'));

      expect(JSON.stringify(result)).toBe('{"success":true}');
    });

    it('wraps a StreamableFile in SuccessResponseDTO', async () => {
      const result = await lastValueFrom(intercept(new TransformInterceptor(), FilesController, 'file'));

      expect(result).toBeInstanceOf(SuccessResponseDTO);
      expect(result).toMatchObject({ success: true, data: expect.any(StreamableFile) });
    });

    it('wraps every SSE event in SuccessResponseDTO', async () => {
      const result = await lastValueFrom(
        intercept(new TransformInterceptor(), FilesController, 'events').pipe(toArray())
      );

      expect(result).toStrictEqual([
        new SuccessResponseDTO({ data: 'ping' }),
        new SuccessResponseDTO({ data: 'pong' }),
      ]);
    });

    it('wraps handler data outside the HTTP context', async () => {
      const result = await lastValueFrom(
        intercept(new TransformInterceptor(), FilesController, 'data', { type: 'rpc' })
      );

      expect(result).toStrictEqual(new SuccessResponseDTO({ id: 1 }));
    });
  });

  describe('skipContentTypes', () => {
    const interceptor = new TransformInterceptor({ skipContentTypes: ['application/pdf'] });

    it('passes data through when Content-Type set before the handler equals a listed type', async () => {
      const result = await lastValueFrom(
        intercept(interceptor, FilesController, 'pdf', { contentType: 'application/pdf' })
      );

      expect(result).toBe(pdf);
    });

    it('wraps data when Content-Type set before the handler carries parameters', async () => {
      const result = await lastValueFrom(
        intercept(interceptor, FilesController, 'pdf', { contentType: 'application/pdf; charset=binary' })
      );

      expect(result).toStrictEqual(new SuccessResponseDTO(pdf));
    });

    it('wraps data when the handler sets Content-Type itself', async () => {
      const result = await lastValueFrom(intercept(interceptor, FilesController, 'generatedPdf'));

      expect(result).toStrictEqual(new SuccessResponseDTO(pdf));
    });
  });
});
