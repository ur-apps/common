import { RefObject, useEffect, useRef, useState } from 'react';

import { useLatest } from '../use-latest.ts';

import { UseFocusOptions } from './types.ts';

export function useFocus<T extends HTMLElement | SVGElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseFocusOptions = {}
): boolean {
  const { disabled = false, onChange } = options;
  const onChangeRef = useLatest(onChange);

  const [focused, setFocused] = useState(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    const element = targetRef.current;

    const update = (value: boolean) => {
      if (value === focusedRef.current) return;

      focusedRef.current = value;
      setFocused(value);
      onChangeRef.current?.(value);
    };

    if (!element || disabled) {
      update(false);

      return;
    }

    const handleFocus = () => update(true);
    const handleBlur = () => update(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [targetRef, onChangeRef, disabled]);

  return focused;
}
