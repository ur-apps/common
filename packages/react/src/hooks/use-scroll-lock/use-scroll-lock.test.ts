import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollLock } from './use-scroll-lock.ts';

const root = document.documentElement;

function setScrollbarWidth(width: number) {
  vi.spyOn(root, 'clientWidth', 'get').mockReturnValue(window.innerWidth - width);
}

function setup(enabled: boolean) {
  return renderHook((props: boolean) => useScrollLock(props), { initialProps: enabled });
}

describe('[hooks] useScrollLock', () => {
  beforeEach(() => {
    root.removeAttribute('style');
    setScrollbarWidth(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('lock', () => {
    it('hides the page overflow when enabled', () => {
      setup(true);

      expect(root.style.overflow).toBe('hidden');
    });

    it('does nothing when disabled', () => {
      setup(false);

      expect(root.style.overflow).toBe('');
    });

    it('locks when enabled after mount', () => {
      const { rerender } = setup(false);

      rerender(true);

      expect(root.style.overflow).toBe('hidden');
    });

    it('unlocks when disabled', () => {
      const { rerender } = setup(true);

      rerender(false);

      expect(root.style.overflow).toBe('');
    });

    it('unlocks on unmount', () => {
      const { unmount } = setup(true);

      unmount();

      expect(root.style.overflow).toBe('');
    });

    it('restores the previous inline overflow', () => {
      root.style.overflow = 'auto';

      const { unmount } = setup(true);

      unmount();

      expect(root.style.overflow).toBe('auto');
    });

    it('locks and unlocks in strict mode', () => {
      const { unmount } = renderHook(() => useScrollLock(true), { wrapper: StrictMode });

      expect(root.style.overflow).toBe('hidden');

      unmount();

      expect(root.style.overflow).toBe('');
    });
  });

  describe('scrollbar', () => {
    it('reserves the space of a visible scrollbar', () => {
      setScrollbarWidth(15);
      setup(true);

      expect(root.style.scrollbarGutter).toBe('stable');
    });

    it('does not reserve space when there is no scrollbar', () => {
      setup(true);

      expect(root.style.scrollbarGutter).toBe('');
    });

    it('restores the previous inline scrollbar gutter', () => {
      root.style.scrollbarGutter = 'auto';
      setScrollbarWidth(15);

      const { unmount } = setup(true);

      unmount();

      expect(root.style.scrollbarGutter).toBe('auto');
    });
  });

  describe('nested locks', () => {
    it('stays locked until the last lock is released', () => {
      const first = setup(true);
      const second = setup(true);

      first.unmount();

      expect(root.style.overflow).toBe('hidden');

      second.unmount();

      expect(root.style.overflow).toBe('');
    });

    it('restores the styles saved by the first lock', () => {
      root.style.overflow = 'auto';
      setScrollbarWidth(15);

      const first = setup(true);
      const second = setup(true);

      second.unmount();
      first.unmount();

      expect(root.style.overflow).toBe('auto');
      expect(root.style.scrollbarGutter).toBe('');
    });
  });
});
