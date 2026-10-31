import { ConsoleLoggerOptions } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

import { getRequestContext, runInRequestContext } from 'helpers';
import { RequestContext } from 'interfaces';

import { AppLogger } from './app.logger.ts';
import { DEFAULT_REDACTED_KEYS } from './constants.ts';

const CONTEXT: RequestContext = { requestId: '3f2a9c1e-7b4d-4e0f-8a6b-5c3d2e1f0a9b', userId: 'user' };

describe('Testing logger: AppLogger', () => {
  let stdout: MockInstance<typeof process.stdout.write>;
  let stderr: MockInstance<typeof process.stderr.write>;

  beforeEach(() => {
    stdout = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    stderr = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** What the logger wrote, one string per entry. */
  const written = () => [...stdout.mock.calls, ...stderr.mock.calls].map(([chunk]) => String(chunk));

  /** The JSON entries the logger wrote. */
  const entries = () => written().map((line) => JSON.parse(line) as Record<string, unknown>);

  const jsonLogger = (options: ConsoleLoggerOptions = {}) => new AppLogger({ json: true, ...options });

  describe('in JSON', () => {
    it('writes every field of the request context at the root of an entry', () => {
      runInRequestContext({ ...CONTEXT }, () => jsonLogger().log('Session revoked', 'SessionsService'));

      expect(entries()).toMatchObject([
        { level: 'log', message: 'Session revoked', context: 'SessionsService', ...CONTEXT },
      ]);
    });

    it('writes a field an application added to the context', () => {
      const context = { ...CONTEXT, dictionaryId: 'dictionary' } as RequestContext;

      runInRequestContext(context, () => jsonLogger().log('Word saved'));

      expect(entries()[0]).toMatchObject({ dictionaryId: 'dictionary' });
    });

    it('writes a field set on the context after it was opened', () => {
      runInRequestContext({ requestId: CONTEXT.requestId }, () => {
        jsonLogger().log('Before');

        const context = getRequestContext();

        if (context) context.userId = 'user';

        jsonLogger().log('After');
      });

      expect(entries().map(({ userId }) => userId)).toStrictEqual([undefined, 'user']);
    });

    it('writes the context into an error entry with its stack', () => {
      runInRequestContext({ ...CONTEXT }, () => jsonLogger().error('Failed', 'Error: Failed\n    at x', 'Filter'));

      expect(stderr).toHaveBeenCalledOnce();
      expect(entries()[0]).toMatchObject({ level: 'error', stack: 'Error: Failed\n    at x', ...CONTEXT });
    });

    it('keeps structured params under params, next to the context', () => {
      runInRequestContext({ ...CONTEXT }, () => jsonLogger().log('Session revoked', { sessionId: 'session' }));

      expect(entries()[0]).toMatchObject({ params: { sessionId: 'session' }, ...CONTEXT });
    });

    it('never replaces a field of the entry with a field of the context', () => {
      const context = { ...CONTEXT, message: 'forged', level: 'fatal' } as RequestContext;

      runInRequestContext(context, () => jsonLogger().log('Real'));

      expect(entries()[0]).toMatchObject({ message: 'Real', level: 'log' });
    });

    it('writes no request fields outside a request', () => {
      jsonLogger().log('Started');

      expect(entries()[0]).not.toHaveProperty('requestId');
      expect(entries()[0]).not.toHaveProperty('userId');
    });
  });

  describe('in text', () => {
    const textLogger = () => new AppLogger({ colors: false });

    it('shows the beginning of the request id next to the context', () => {
      runInRequestContext({ ...CONTEXT }, () => textLogger().log('Session revoked', 'SessionsService'));

      expect(written()[0]).toContain('[SessionsService] [3f2a9c1e] Session revoked');
    });

    it('shows the beginning of the request id when the entry has no context', () => {
      runInRequestContext({ ...CONTEXT }, () => textLogger().log('Session revoked'));

      expect(written()[0]).toContain('[3f2a9c1e] Session revoked');
    });

    it('shows no request id outside a request', () => {
      textLogger().log('Started', 'Bootstrap');

      expect(written()[0]).toContain('[Bootstrap] Started');
      expect(written()[0]).not.toMatch(/\[Bootstrap\] \[/);
    });
  });

  describe('masking', () => {
    it.each(DEFAULT_REDACTED_KEYS)('masks %s by default', (key) => {
      jsonLogger().log('Signed in', { [key]: 'secret', email: 'user@example.com' });

      expect(entries()[0].params).toStrictEqual({ [key]: '[REDACTED]', email: 'user@example.com' });
    });

    it('masks what the options name instead of the default keys', () => {
      jsonLogger({ redact: ['apiKey'] }).log('Called', { apiKey: 'secret', password: 'plain' });

      expect(entries()[0].params).toStrictEqual({ apiKey: '[REDACTED]', password: 'plain' });
    });
  });
});
