import { useEffect, useLayoutEffect } from 'react';

/**
 * A hook that uses `useLayoutEffect` on the client and `useEffect` on the server.
 * This is useful for avoiding hydration mismatches in server-rendered React applications.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
