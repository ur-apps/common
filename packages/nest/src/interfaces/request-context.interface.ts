declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace UrappsNest {
    /**
     * What is known about the HTTP request being handled.
     * `AppLogger` writes every field into each entry logged while the request is handled.
     * An application declares fields of its own by merging into this interface.
     *
     * @example
     * declare global {
     *   namespace UrappsNest {
     *     interface RequestContext {
     *       dictionaryId?: string;
     *     }
     *   }
     * }
     */
    interface RequestContext {
      /** Identifies the request across the entries logged for it; sent back in the `X-Request-Id` header. */
      requestId: string;
      /** The account the request is authenticated as, once authentication has accepted it. */
      userId?: string;
    }
  }
}

export type RequestContext = UrappsNest.RequestContext;
