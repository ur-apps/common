import { AsyncLocalStorage } from 'node:async_hooks';

import { RequestContext } from 'interfaces';

const STORAGE_KEY = Symbol.for('@urapps/nest:request-context');

type StorageHolder = typeof globalThis & { [STORAGE_KEY]?: AsyncLocalStorage<RequestContext> };

/**
 * One storage per process, shared by every copy of the package,
 * so that a context opened by one copy is seen by another.
 */
const storage = ((globalThis as StorageHolder)[STORAGE_KEY] ??= new AsyncLocalStorage<RequestContext>());

/**
 * Runs the callback, and everything it starts, with the context given.
 *
 * @example
 * runInRequestContext({ requestId: randomUUID() }, next);
 */
export function runInRequestContext<T>(context: RequestContext, callback: () => T): T {
  return storage.run(context, callback);
}

/**
 * The context of the request being handled, undefined outside a request, such as in a scheduled job.
 * The object is shared by everything that handles the request, so a field set on it is seen from then on.
 *
 * @example
 * // in an authentication guard, once the token is accepted
 * const context = getRequestContext();
 *
 * if (context) context.userId = payload.sub;
 */
export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}
