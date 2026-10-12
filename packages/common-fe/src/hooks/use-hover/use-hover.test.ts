import { RefObject } from 'react';
import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PointerType, UseHoverOptions } from './types.ts';
import { useHover } from './use-hover.ts';

function setup(options?: UseHoverOptions, target: HTMLElement | SVGElement = document.createElement('div')) {
  const ref: RefObject<HTMLElement | SVGElement | null> = { current: target };
  const hook = renderHook((props?: UseHoverOptions) => useHover(ref, props), { initialProps: options });

  return { target, ...hook };
}

function pointerEnter(target: Element, pointerType: PointerType = 'mouse') {
  fireEvent.pointerEnter(target, { pointerType });
}

function pointerLeave(target: Element, pointerType: PointerType = 'mouse') {
  fireEvent.pointerLeave(target, { pointerType });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('[hooks] useHover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('hover', () => {
    it('is not hovered initially', () => {
      const { result } = setup();

      expect(result.current).toBe(false);
    });

    it('becomes hovered on pointer enter and unhovered on pointer leave', () => {
      const { target, result } = setup();

      pointerEnter(target);

      expect(result.current).toBe(true);

      pointerLeave(target);

      expect(result.current).toBe(false);
    });

    it('works with an SVG element', () => {
      const { target, result } = setup({}, document.createElementNS('http://www.w3.org/2000/svg', 'svg'));

      pointerEnter(target);

      expect(result.current).toBe(true);
    });

    it('stays unhovered when the ref is empty', () => {
      const { result } = renderHook(() => useHover({ current: null }));

      expect(result.current).toBe(false);
    });
  });

  describe('pointerTypes', () => {
    it('accepts mouse and pen by default', () => {
      const { target, result } = setup();

      pointerEnter(target, 'pen');

      expect(result.current).toBe(true);
    });

    it('ignores touch by default', () => {
      const { target, result } = setup();

      pointerEnter(target, 'touch');

      expect(result.current).toBe(false);
    });

    it('accepts only the listed pointer types', () => {
      const { target, result } = setup({ pointerTypes: ['touch'] });

      pointerEnter(target, 'mouse');

      expect(result.current).toBe(false);

      pointerEnter(target, 'touch');

      expect(result.current).toBe(true);
    });

    it('ignores a leave from a pointer type that is not listed', () => {
      const { target, result } = setup();

      pointerEnter(target, 'mouse');
      pointerLeave(target, 'touch');

      expect(result.current).toBe(true);
    });

    it('accepts every pointer type when the list is empty', () => {
      const { target, result } = setup({ pointerTypes: [] });

      pointerEnter(target, 'touch');

      expect(result.current).toBe(true);
    });
  });

  describe('enterDelay', () => {
    it('becomes hovered only after the delay', () => {
      const { target, result } = setup({ enterDelay: 500 });

      pointerEnter(target);
      advance(499);

      expect(result.current).toBe(false);

      advance(1);

      expect(result.current).toBe(true);
    });

    it('does not become hovered when the pointer leaves before the delay', () => {
      const { target, result } = setup({ enterDelay: 500 });

      pointerEnter(target);
      advance(200);
      pointerLeave(target);
      advance(500);

      expect(result.current).toBe(false);
    });

    it('keeps the delay running across a re-render', () => {
      const { target, result, rerender } = setup({ enterDelay: 500 });

      pointerEnter(target);
      advance(200);
      rerender({ enterDelay: 500 });
      advance(300);

      expect(result.current).toBe(true);
    });

    it('applies a changed delay to the next enter', () => {
      const { target, result, rerender } = setup({ enterDelay: 500 });

      rerender({ enterDelay: 100 });
      pointerEnter(target);
      advance(100);

      expect(result.current).toBe(true);
    });
  });

  describe('leaveDelay', () => {
    it('becomes unhovered only after the delay', () => {
      const { target, result } = setup({ leaveDelay: 300 });

      pointerEnter(target);
      pointerLeave(target);
      advance(299);

      expect(result.current).toBe(true);

      advance(1);

      expect(result.current).toBe(false);
    });

    it('stays hovered when the pointer comes back before the delay', () => {
      const { target, result } = setup({ leaveDelay: 300 });

      pointerEnter(target);
      pointerLeave(target);
      advance(200);
      pointerEnter(target);
      advance(300);

      expect(result.current).toBe(true);
    });
  });

  describe('onChange', () => {
    it('is called with the new state on enter and leave', () => {
      const onChange = vi.fn();
      const { target } = setup({ onChange });

      pointerEnter(target);
      pointerLeave(target);

      expect(onChange.mock.calls).toEqual([[true], [false]]);
    });

    it('is called when a delay ends, not on the event', () => {
      const onChange = vi.fn();
      const { target } = setup({ enterDelay: 500, leaveDelay: 300, onChange });

      pointerEnter(target);
      advance(499);

      expect(onChange).not.toHaveBeenCalled();

      advance(1);

      expect(onChange).toHaveBeenLastCalledWith(true);

      pointerLeave(target);
      advance(299);

      expect(onChange).toHaveBeenCalledTimes(1);

      advance(1);

      expect(onChange).toHaveBeenLastCalledWith(false);
    });

    it('calls the latest callback', () => {
      const first = vi.fn();
      const second = vi.fn();
      const { target, rerender } = setup({ onChange: first });

      rerender({ onChange: second });
      pointerEnter(target);

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledWith(true);
    });

    it('calls the latest callback when a delay ends', () => {
      const first = vi.fn();
      const second = vi.fn();
      const third = vi.fn();
      const { target, rerender } = setup({ enterDelay: 500, leaveDelay: 300, onChange: first });

      pointerEnter(target);
      rerender({ enterDelay: 500, leaveDelay: 300, onChange: second });
      advance(500);
      pointerLeave(target);
      rerender({ enterDelay: 500, leaveDelay: 300, onChange: third });
      advance(300);

      expect(first).not.toHaveBeenCalled();
      expect(second.mock.calls).toEqual([[true]]);
      expect(third.mock.calls).toEqual([[false]]);
    });
  });

  describe('disabled', () => {
    it('ignores pointer events', () => {
      const { target, result } = setup({ disabled: true });

      pointerEnter(target);

      expect(result.current).toBe(false);
    });

    it('resets the hovered state when disabled', () => {
      const { target, result, rerender } = setup();

      pointerEnter(target);

      expect(result.current).toBe(true);

      rerender({ disabled: true });

      expect(result.current).toBe(false);
    });

    it('calls onChange with false when disabled while hovered', () => {
      const onChange = vi.fn();
      const { target, rerender } = setup({ onChange });

      pointerEnter(target);
      rerender({ onChange, disabled: true });

      expect(onChange.mock.calls).toEqual([[true], [false]]);
    });

    it('does not call onChange when disabled while not hovered', () => {
      const onChange = vi.fn();
      const { rerender } = setup({ onChange });

      rerender({ onChange, disabled: true });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('cancels a pending enter when disabled', () => {
      const { target, result, rerender } = setup({ enterDelay: 500 });

      pointerEnter(target);
      rerender({ enterDelay: 500, disabled: true });
      advance(500);

      expect(result.current).toBe(false);
    });

    it('tracks hover again when re-enabled', () => {
      const { target, result, rerender } = setup({ disabled: true });

      rerender({ disabled: false });
      pointerEnter(target);

      expect(result.current).toBe(true);
    });
  });

  describe('unmount', () => {
    it('cancels pending delays', () => {
      const onChange = vi.fn();
      const { target, unmount } = setup({ enterDelay: 500, onChange });

      pointerEnter(target);
      unmount();
      advance(500);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('stops listening to the element', () => {
      const onChange = vi.fn();
      const { target, unmount } = setup({ onChange });

      unmount();
      pointerEnter(target);

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
