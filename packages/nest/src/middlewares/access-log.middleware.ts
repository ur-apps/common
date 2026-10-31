import { AsyncResource } from 'node:async_hooks';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { isString } from '@urapps/common';

/** What Express adds to a request that the access log reads: the URL as it arrived and the route that matched it. */
type RoutedRequest = IncomingMessage & { originalUrl?: string; route?: { path?: unknown } };

/**
 * Logs one entry for each request once its response is done:
 * the method, the route that matched (or the path, when none did), the status and how long the handling took.
 * A response cut short by the client is logged too, marked as aborted.
 * The entry is written in the request's context,
 * so it carries the fields `RequestContextMiddleware` opened, which therefore has to run first.
 *
 * @example
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(RequestContextMiddleware).forRoutes('*');
 *     consumer.apply(AccessLogMiddleware).exclude('app/health').forRoutes('*');
 *   }
 * }
 */
@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AccessLogMiddleware.name);

  use(request: RoutedRequest, response: ServerResponse, next: () => void): void {
    const startedAt = performance.now();

    response.once(
      'close',
      AsyncResource.bind(() => {
        const method = request.method;
        const route = isString(request.route?.path) ? request.route.path : this.getPath(request);
        const statusCode = response.statusCode;
        const durationMs = Math.round(performance.now() - startedAt);
        const aborted = !response.writableFinished;

        this.logger.log(
          `${method} ${route} ${statusCode} ${durationMs}ms${aborted ? ' aborted' : ''}`,
          aborted ? { method, route, statusCode, durationMs, aborted } : { method, route, statusCode, durationMs }
        );
      })
    );

    next();
  }

  private getPath(request: RoutedRequest): string {
    return (request.originalUrl ?? request.url ?? '').split(/[?#]/)[0];
  }
}
