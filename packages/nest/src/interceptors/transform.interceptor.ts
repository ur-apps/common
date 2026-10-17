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
   * Content types to skip transformation for.
   * Matched against the media type of the response `Content-Type` once the handler has run,
   * ignoring parameters such as `charset` and letter case.
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

    return next.handle().pipe(
      map((data) => {
        if (
          data instanceof SuccessResponseDTO ||
          data instanceof StreamableFile ||
          this.hasSkippedContentType(context)
        ) {
          return data;
        }

        return new SuccessResponseDTO(data);
      })
    );
  }

  private hasSkippedContentType(context: ExecutionContext): boolean {
    if (context.getType() !== 'http' || !this.options.skipContentTypes) {
      return false;
    }

    const contentType = context.switchToHttp().getResponse<Response>().getHeader('Content-Type');

    if (typeof contentType !== 'string') {
      return false;
    }

    const mediaType = contentType.split(';')[0].trim().toLowerCase();

    return this.options.skipContentTypes.some((type) => type.toLowerCase() === mediaType);
  }
}
