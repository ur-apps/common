import { createServer, IncomingMessage, Server, ServerResponse } from 'node:http';
import { AddressInfo } from 'node:net';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRequestContext, runInRequestContext } from 'helpers';
import { RequestContext } from 'interfaces';

import { AccessLogMiddleware } from './access-log.middleware.ts';

interface Entry {
  message: unknown;
  params: unknown;
  /** The request context the entry was logged in. */
  context?: RequestContext;
}

type Handler = (request: IncomingMessage & { route?: { path: string } }, response: ServerResponse) => void;

const REQUEST_ID = '3f2a9c1e-7b4d-4e0f-8a6b-5c3d2e1f0a9b';

describe('Testing middleware: AccessLogMiddleware', () => {
  let server: Server | undefined;
  let entries: Entry[];

  beforeEach(() => {
    entries = [];

    vi.spyOn(Logger.prototype, 'log').mockImplementation((message: unknown, params?: unknown) => {
      const context = getRequestContext();

      entries.push({ message, params, context: context && { ...context } });
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();

    await new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve()));
    server = undefined;
  });

  /**
   * Starts a server that handles each request inside a request context, through the middleware and then the handler,
   * and returns its address.
   */
  async function serve(handler: Handler): Promise<string> {
    server = createServer((request, response) =>
      runInRequestContext({ requestId: REQUEST_ID }, () =>
        new AccessLogMiddleware().use(request, response, () => handler(request, response))
      )
    );

    await new Promise<void>((resolve) => server?.listen(0, '127.0.0.1', resolve));

    return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  }

  /** Waits for the one entry a request logs. */
  async function loggedEntry(): Promise<Entry> {
    await vi.waitFor(() => expect(entries).toHaveLength(1));

    return entries[0];
  }

  it('is provided when registered by class', async () => {
    const moduleRef = await Test.createTestingModule({ providers: [AccessLogMiddleware] }).compile();

    expect(moduleRef.get(AccessLogMiddleware)).toBeInstanceOf(AccessLogMiddleware);
  });

  it('logs the method, the path, the status and the duration once the request is answered', async () => {
    const url = await serve((_, response) => {
      response.statusCode = 201;
      response.end();
    });

    await fetch(`${url}/words`, { method: 'POST' });

    const { message, params } = await loggedEntry();

    expect(message).toMatch(/^POST \/words 201 \d+ms$/);
    expect(params).toStrictEqual({ method: 'POST', route: '/words', statusCode: 201, durationMs: expect.any(Number) });
  });

  it('logs the route that matched instead of the path', async () => {
    const url = await serve((request, response) => {
      request.route = { path: '/dictionaries/:dictionaryId/words/:word' };
      response.end();
    });

    await fetch(`${url}/dictionaries/9840ed8c/words/present`);

    expect((await loggedEntry()).params).toMatchObject({ route: '/dictionaries/:dictionaryId/words/:word' });
  });

  it('leaves the query string out of the path', async () => {
    const url = await serve((_, response) => response.end());

    await fetch(`${url}/pronunciations?word=present&language=en`);

    expect((await loggedEntry()).params).toMatchObject({ route: '/pronunciations' });
  });

  it('writes the entry in the context of the request', async () => {
    const url = await serve((_, response) => response.end());

    await fetch(url);

    expect((await loggedEntry()).context).toStrictEqual({ requestId: REQUEST_ID });
  });

  it('writes a field set on the context while the request was handled', async () => {
    const url = await serve((_, response) => {
      const context = getRequestContext();

      if (context) context.userId = 'user';

      response.end();
    });

    await fetch(url);

    expect((await loggedEntry()).context).toStrictEqual({ requestId: REQUEST_ID, userId: 'user' });
  });

  it('logs a response cut short by the client as aborted', async () => {
    const url = await serve((_, response) => {
      response.writeHead(200);
      response.write('partial');
    });

    const controller = new AbortController();

    await fetch(url, { signal: controller.signal });
    controller.abort();

    const { message, params, context } = await loggedEntry();

    expect(message).toMatch(/^GET \/ 200 \d+ms aborted$/);
    expect(params).toMatchObject({ aborted: true });
    expect(context).toStrictEqual({ requestId: REQUEST_ID });
  });
});
