import { RefObject } from 'react';
import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UseFocusOptions } from './types.ts';
import { useFocus } from './use-focus.ts';

function setup(options?: UseFocusOptions) {
  const target = document.createElement('button');
  const ref: RefObject<HTMLElement | null> = { current: target };
  const hook = renderHook((props?: UseFocusOptions) => useFocus(ref, props), { initialProps: options });

  return { target, ...hook };
}

describe('[hooks] useFocus', () => {
  describe('focus', () => {
    it('is not focused initially', () => {
      const { result } = setup();

      expect(result.current).toBe(false);
    });

    it('becomes focused on focus and unfocused on blur', () => {
      const { target, result } = setup();

      fireEvent.focus(target);

      expect(result.current).toBe(true);

      fireEvent.blur(target);

      expect(result.current).toBe(false);
    });

    it('stays unfocused when the ref is empty', () => {
      const { result } = renderHook(() => useFocus({ current: null }));

      expect(result.current).toBe(false);
    });
  });

  describe('onChange', () => {
    it('is called with the new state on focus and blur', () => {
      const onChange = vi.fn();
      const { target } = setup({ onChange });

      fireEvent.focus(target);
      fireEvent.blur(target);

      expect(onChange.mock.calls).toEqual([[true], [false]]);
    });

    it('calls the latest callback', () => {
      const first = vi.fn();
      const second = vi.fn();
      const { target, rerender } = setup({ onChange: first });

      rerender({ onChange: second });
      fireEvent.focus(target);

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledWith(true);
    });
  });

  describe('visibleOnly', () => {
    it('tracks focus that is not focus-visible by default', () => {
      const { target, result } = setup();

      vi.spyOn(target, 'matches').mockReturnValue(false);
      fireEvent.focus(target);

      expect(result.current).toBe(true);
    });

    it('ignores focus that is not focus-visible', () => {
      const onChange = vi.fn();
      const { target, result } = setup({ visibleOnly: true, onChange });

      vi.spyOn(target, 'matches').mockReturnValue(false);
      fireEvent.focus(target);

      expect(result.current).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('tracks focus-visible focus', () => {
      const { target, result } = setup({ visibleOnly: true });

      vi.spyOn(target, 'matches').mockImplementation((selector) => selector === ':focus-visible');
      fireEvent.focus(target);

      expect(result.current).toBe(true);

      fireEvent.blur(target);

      expect(result.current).toBe(false);
    });
  });

  describe('disabled', () => {
    it('ignores focus', () => {
      const { target, result } = setup({ disabled: true });

      fireEvent.focus(target);

      expect(result.current).toBe(false);
    });

    it('resets the focused state when disabled', () => {
      const { target, result, rerender } = setup();

      fireEvent.focus(target);

      expect(result.current).toBe(true);

      rerender({ disabled: true });

      expect(result.current).toBe(false);
    });

    it('calls onChange with false when disabled while focused', () => {
      const onChange = vi.fn();
      const { target, rerender } = setup({ onChange });

      fireEvent.focus(target);
      rerender({ onChange, disabled: true });

      expect(onChange.mock.calls).toEqual([[true], [false]]);
    });

    it('does not call onChange when disabled while not focused', () => {
      const onChange = vi.fn();
      const { rerender } = setup({ onChange });

      rerender({ onChange, disabled: true });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('tracks focus again when re-enabled', () => {
      const { target, result, rerender } = setup({ disabled: true });

      rerender({ disabled: false });
      fireEvent.focus(target);

      expect(result.current).toBe(true);
    });
  });

  describe('unmount', () => {
    it('stops listening to the element', () => {
      const onChange = vi.fn();
      const { target, unmount } = setup({ onChange });

      unmount();
      fireEvent.focus(target);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when unmounted while focused', () => {
      const onChange = vi.fn();
      const { target, unmount } = setup({ onChange });

      fireEvent.focus(target);
      unmount();

      expect(onChange.mock.calls).toEqual([[true]]);
    });
  });
});
