import { createRef, Ref } from 'react';
import { render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMergeRefs } from './use-merge-refs.ts';

function Target({ refs }: { refs: (Ref<HTMLDivElement> | undefined)[] }) {
  const ref = useMergeRefs(...refs);

  return <div ref={ref} data-testid="target" />;
}

describe('[hooks] useMergeRefs', () => {
  describe('attach', () => {
    it('sets an object ref', () => {
      const ref = createRef<HTMLDivElement>();
      const { getByTestId } = render(<Target refs={[ref]} />);

      expect(ref.current).toBe(getByTestId('target'));
    });

    it('calls a callback ref with the element', () => {
      const ref = vi.fn();
      const { getByTestId } = render(<Target refs={[ref]} />);

      expect(ref).toHaveBeenCalledWith(getByTestId('target'));
    });

    it('sets every given ref', () => {
      const objectRef = createRef<HTMLDivElement>();
      const callbackRef = vi.fn();
      const { getByTestId } = render(<Target refs={[objectRef, callbackRef]} />);
      const target = getByTestId('target');

      expect(objectRef.current).toBe(target);
      expect(callbackRef).toHaveBeenCalledWith(target);
    });

    it('skips undefined and null refs', () => {
      const ref = createRef<HTMLDivElement>();
      const { getByTestId } = render(<Target refs={[undefined, null, ref]} />);

      expect(ref.current).toBe(getByTestId('target'));
    });
  });

  describe('detach', () => {
    it('resets an object ref on unmount', () => {
      const ref = createRef<HTMLDivElement>();
      const { unmount } = render(<Target refs={[ref]} />);

      unmount();

      expect(ref.current).toBeNull();
    });

    it('calls a callback ref with null on unmount', () => {
      const ref = vi.fn();
      const { unmount } = render(<Target refs={[ref]} />);

      ref.mockClear();
      unmount();

      expect(ref).toHaveBeenCalledWith(null);
    });

    it('calls the cleanup returned by a callback ref instead of passing null', () => {
      const cleanup = vi.fn();
      const ref = vi.fn(() => cleanup);
      const { unmount } = render(<Target refs={[ref]} />);

      ref.mockClear();
      unmount();

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(ref).not.toHaveBeenCalled();
    });
  });

  describe('identity', () => {
    it('keeps the callback while the refs stay the same', () => {
      const ref = createRef<HTMLDivElement>();
      const { result, rerender } = renderHook(() => useMergeRefs(ref));
      const first = result.current;

      rerender();

      expect(result.current).toBe(first);
    });

    it('returns a new callback when a ref changes', () => {
      const { result, rerender } = renderHook((props: Ref<HTMLDivElement>) => useMergeRefs(props), {
        initialProps: createRef<HTMLDivElement>(),
      });
      const first = result.current;

      rerender(createRef<HTMLDivElement>());

      expect(result.current).not.toBe(first);
    });

    it('returns a new callback when the number of refs changes', () => {
      const ref = createRef<HTMLDivElement>();
      const { result, rerender } = renderHook((props: Ref<HTMLDivElement>[]) => useMergeRefs(...props), {
        initialProps: [ref],
      });
      const first = result.current;

      rerender([ref, createRef<HTMLDivElement>()]);

      expect(result.current).not.toBe(first);
    });

    it('moves the element to the new ref when a ref changes', () => {
      const first = createRef<HTMLDivElement>();
      const second = createRef<HTMLDivElement>();
      const { getByTestId, rerender } = render(<Target refs={[first]} />);

      rerender(<Target refs={[second]} />);

      expect(first.current).toBeNull();
      expect(second.current).toBe(getByTestId('target'));
    });
  });
});
