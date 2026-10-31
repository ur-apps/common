import { setImmediate } from 'node:timers/promises';
import { describe, expect, it, vi } from 'vitest';

import { getRequestContext, runInRequestContext } from './request-context.ts';

describe('Testing helper: request context', () => {
  it('has no context outside a request', () => {
    expect(getRequestContext()).toBeUndefined();
  });

  it('returns what the callback returns', () => {
    expect(runInRequestContext({ requestId: 'a' }, () => 42)).toBe(42);
  });

  it('gives the context to the callback and to what it awaits', async () => {
    await runInRequestContext({ requestId: 'a' }, async () => {
      expect(getRequestContext()).toStrictEqual({ requestId: 'a' });

      await setImmediate();

      expect(getRequestContext()).toStrictEqual({ requestId: 'a' });
    });
  });

  it('closes the context once the callback has run', () => {
    runInRequestContext({ requestId: 'a' }, getRequestContext);

    expect(getRequestContext()).toBeUndefined();
  });

  it('keeps a field set on the context for the rest of the request', async () => {
    await runInRequestContext({ requestId: 'a' }, async () => {
      const context = getRequestContext();

      if (context) context.userId = 'user';

      await setImmediate();

      expect(getRequestContext()).toStrictEqual({ requestId: 'a', userId: 'user' });
    });
  });

  it('keeps the contexts of concurrent requests apart', async () => {
    const seen = await Promise.all(
      ['a', 'b'].map((requestId) =>
        runInRequestContext({ requestId }, async () => {
          await setImmediate();

          return getRequestContext()?.requestId;
        })
      )
    );

    expect(seen).toStrictEqual(['a', 'b']);
  });

  it('is shared with another copy of the package', async () => {
    vi.resetModules();

    const copy = await import('./request-context.ts');

    expect(copy.getRequestContext).not.toBe(getRequestContext);

    runInRequestContext({ requestId: 'a' }, () => {
      expect(copy.getRequestContext()).toStrictEqual({ requestId: 'a' });
    });
  });
});
