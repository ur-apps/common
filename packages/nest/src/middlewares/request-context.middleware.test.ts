import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { getRequestContext } from 'helpers';
import { RequestContext } from 'interfaces';

import { REQUEST_ID_HEADER, RequestContextMiddleware } from './request-context.middleware.ts';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * Runs the middleware for a request carrying the given `X-Request-Id`,
 * and returns the context `next` was called in along with the header sent back.
 */
function handle(incomingRequestId?: string) {
  const request = new IncomingMessage(new Socket());
  const response = new ServerResponse(request);

  if (incomingRequestId !== undefined) {
    request.headers['x-request-id'] = incomingRequestId;
  }

  let context: RequestContext | undefined;

  new RequestContextMiddleware().use(request, response, () => {
    context = getRequestContext();
  });

  return { context, header: response.getHeader(REQUEST_ID_HEADER) };
}

describe('Testing middleware: RequestContextMiddleware', () => {
  it('is provided when registered by class', async () => {
    const moduleRef = await Test.createTestingModule({ providers: [RequestContextMiddleware] }).compile();

    expect(moduleRef.get(RequestContextMiddleware)).toBeInstanceOf(RequestContextMiddleware);
  });

  it('calls next in a context with a new request id when the request carries none', () => {
    const { context, header } = handle();

    expect(context?.requestId).toMatch(UUID_PATTERN);
    expect(header).toBe(context?.requestId);
  });

  it.each(['3f2a9c1e7b4d4e0f8a6b5c3d2e1f0a9b', 'b8e1d1c2-5f3a-4c6e-9a7b-0d1e2f3a4b5c', 'edge.req-17_a'])(
    'takes over the request id %j the request carries',
    (requestId) => {
      const { context, header } = handle(requestId);

      expect(context).toStrictEqual({ requestId });
      expect(header).toBe(requestId);
    }
  );

  it.each(['', 'two words', 'line\nbreak', 'a'.repeat(65), '<script>'])(
    'makes a new request id instead of %j',
    (requestId) => {
      const { context, header } = handle(requestId);

      expect(context?.requestId).toMatch(UUID_PATTERN);
      expect(header).toBe(context?.requestId);
    }
  );

  it('makes a different request id for each request', () => {
    expect(handle().context?.requestId).not.toBe(handle().context?.requestId);
  });

  it('leaves no context once the request has been passed on', () => {
    handle();

    expect(getRequestContext()).toBeUndefined();
  });
});
