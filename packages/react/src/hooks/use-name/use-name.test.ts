import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useName } from './use-name.ts';

describe('[hooks] useName', () => {
  it('returns the provided name', () => {
    const { result } = renderHook(() => useName('email'));

    expect(result.current).toBe('email');
  });

  it('keeps an empty name', () => {
    const { result } = renderHook(() => useName(''));

    expect(result.current).toBe('');
  });

  it('returns a non-empty fallback when no name is provided', () => {
    const { result } = renderHook(() => useName());

    expect(result.current).toEqual(expect.any(String));
    expect(result.current).not.toBe('');
  });

  it('keeps the fallback across re-renders', () => {
    const { result, rerender } = renderHook(() => useName());
    const fallback = result.current;

    rerender();

    expect(result.current).toBe(fallback);
  });

  it('returns a different fallback for each instance', () => {
    const { result: first } = renderHook(() => useName());
    const { result: second } = renderHook(() => useName());

    expect(first.current).not.toBe(second.current);
  });

  it('switches between the provided name and the fallback', () => {
    const { result, rerender } = renderHook((name?: string) => useName(name), { initialProps: undefined });
    const fallback = result.current;

    rerender('email');

    expect(result.current).toBe('email');

    rerender(undefined);

    expect(result.current).toBe(fallback);
  });
});
