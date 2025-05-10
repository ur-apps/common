import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuccessResponseDTO } from 'dto';

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
  constructor(private options: TransformInterceptorOptions = {}) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseDTO | unknown> {
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
        if (data instanceof SuccessResponseDTO) {
          return data;
        }

        return new SuccessResponseDTO(data);
      })
    );
  }
}
