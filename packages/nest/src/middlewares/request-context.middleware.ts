import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isString } from '@urapps/common';

import { runInRequestContext } from 'helpers';

/** Carries the request id in, from a proxy that assigned one, and out, in every response. */
export const REQUEST_ID_HEADER = 'X-Request-Id';

/**
 * An incoming request id is taken over only in this shape,
 * so that a client cannot write arbitrary text into logs.
 */
const REQUEST_ID_PATTERN = /^[\w.-]{1,64}$/;

/**
 * Opens the request context for the rest of the handling of a request.
 * The request id is taken from the incoming
 * `X-Request-Id` header when it has a safe shape, a new one is made otherwise,
 * and it is sent back in the response.
 *
 * @example
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(RequestContextMiddleware).forRoutes('{*path}');
 *   }
 * }
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: IncomingMessage, response: ServerResponse, next: () => void): void {
    const incoming = request.headers[REQUEST_ID_HEADER.toLowerCase()];
    const requestId = isString(incoming) && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();

    response.setHeader(REQUEST_ID_HEADER, requestId);

    runInRequestContext({ requestId }, next);
  }
}
