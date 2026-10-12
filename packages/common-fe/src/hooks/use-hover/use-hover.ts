import { RefObject, useEffect, useRef, useState } from 'react';

import { useLatest } from '../use-latest.ts';

import { DEFAULT_POINTER_TYPES, ENTER_EVENT, LEAVE_EVENT } from './constants.ts';
import { PointerType, UseHoverOptions } from './types.ts';

export function useHover<T extends HTMLElement | SVGElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseHoverOptions = {}
): boolean {
  const { enterDelay = 0, leaveDelay = 0, disabled = false, pointerTypes = DEFAULT_POINTER_TYPES, onChange } = options;
  const optionsRef = useLatest({ enterDelay, leaveDelay, pointerTypes, onChange });

  const [hovered, setHovered] = useState(false);
  const hoveredRef = useLatest(hovered);

  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const clearTimer = (timerRef: RefObject<number | null>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const element: GlobalEventHandlers | null = targetRef.current;

    if (!element || disabled) {
      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      setHovered(false);

      if (hoveredRef.current) {
        optionsRef.current.onChange?.(false);
      }

      return;
    }

    const matchesPointer = (evt: PointerEvent) => {
      const { pointerTypes } = optionsRef.current;

      if (pointerTypes.length) {
        return pointerTypes.includes(evt.pointerType as PointerType);
      }

      return true;
    };

    const handleEnter = (evt: PointerEvent) => {
      if (!matchesPointer(evt)) return;

      const { enterDelay, onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      if (enterDelay > 0) {
        enterTimer.current = setTimeout(() => {
          setHovered(true);
          optionsRef.current.onChange?.(true);
        }, enterDelay);
      } else {
        setHovered(true);
        onChange?.(true);
      }
    };

    const handleLeave = (evt: PointerEvent) => {
      if (!matchesPointer(evt)) return;

      const { leaveDelay, onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      if (leaveDelay > 0) {
        leaveTimer.current = setTimeout(() => {
          setHovered(false);
          optionsRef.current.onChange?.(false);
        }, leaveDelay);
      } else {
        setHovered(false);
        onChange?.(false);
      }
    };

    element.addEventListener(ENTER_EVENT, handleEnter);
    element.addEventListener(LEAVE_EVENT, handleLeave);

    return () => {
      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      element.removeEventListener(ENTER_EVENT, handleEnter);
      element.removeEventListener(LEAVE_EVENT, handleLeave);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef.current, optionsRef, disabled]);

  return hovered;
}
