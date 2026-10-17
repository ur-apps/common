import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Optional, StreamableFile } from '@nestjs/common';
import { SSE_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuccessResponseDTO } from 'dtos';

/**
 * Options for TransformInterceptor
 */
export interface TransformInterceptorOptions {
  /**
   * Content types to skip transformation for
   * @example ['application/octet-stream', 'application/pdf']
   */
  skipContentTypes?: string[];
}

/**
 * Transforms successful responses to standard format with { success: true, data: ... }
 * `StreamableFile` results and `@Sse()` streams are passed through as they are.
 *
 * @example
 * // Global registration
 * app.useGlobalInterceptors(new TransformInterceptor());
 *
 * // Controller-level registration
 * @UseInterceptors(TransformInterceptor)
 * export class UsersController {}
 *
 * // With options
 * @UseInterceptors(new TransformInterceptor({
 *   skipContentTypes: ['application/octet-stream']
 * }))
 * downloadFile() { ... }
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly reflector = new Reflector();

  constructor(@Optional() private options: TransformInterceptorOptions = {}) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseDTO | unknown> {
    if (this.reflector.get(SSE_METADATA, context.getHandler())) {
      return next.handle();
    }

    // Skip transformation for binary responses or other specified content types
    if (context.getType() === 'http') {
      const response = context.switchToHttp().getResponse<Response>();
      const contentType = response.getHeader('Content-Type');

      if (contentType && this.options.skipContentTypes?.includes(contentType as string)) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessResponseDTO || data instanceof StreamableFile) {
          return data;
        }

        return new SuccessResponseDTO(data);
      })
    );
  }
}
