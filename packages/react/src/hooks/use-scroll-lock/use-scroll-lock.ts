import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow = '';
let savedScrollbarGutter = '';

function lock() {
  lockCount += 1;

  if (lockCount > 1) return;

  const root = document.documentElement;
  const hasScrollbar = window.innerWidth > root.clientWidth;

  savedOverflow = root.style.overflow;
  savedScrollbarGutter = root.style.scrollbarGutter;

  root.style.overflow = 'hidden';

  if (hasScrollbar) {
    root.style.scrollbarGutter = 'stable';
  }
}

function unlock() {
  lockCount -= 1;

  if (lockCount > 0) return;

  const root = document.documentElement;

  root.style.overflow = savedOverflow;
  root.style.scrollbarGutter = savedScrollbarGutter;
}

/**
 * Custom hook that prevents the page from scrolling while enabled.
 * Nested locks are counted, so the page is unlocked only when the last one is released.
 * The space of a visible scrollbar is kept reserved, so the page layout does not shift.
 *
 * @param enabled - Whether the page scroll should be locked.
 */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    lock();

    return unlock;
  }, [enabled]);
}
