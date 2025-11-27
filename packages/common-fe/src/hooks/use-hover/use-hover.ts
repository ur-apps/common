import { RefObject, useEffect, useRef, useState } from 'react';

import { useLatest } from '../use-latest';

import { BLUR_EVENT, DEFAULT_POINTER_TYPES, ENTER_EVENT, FOCUS_EVENT, LEAVE_EVENT } from './constants';
import { PointerType, UseHoverOptions } from './types';

export function useHover<T extends HTMLElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseHoverOptions = {}
): boolean {
  const {
    enterDelay = 0,
    leaveDelay = 0,
    disabled = false,
    includeFocus = false,
    pointerTypes = DEFAULT_POINTER_TYPES,
    onChange,
  } = options;
  const optionsRef = useLatest({ enterDelay, leaveDelay, pointerTypes, onChange });

  const [hovered, setHovered] = useState(false);

  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const clearTimer = (timerRef: RefObject<number | null>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const element = targetRef.current;

    if (!element || disabled) {
      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      setHovered(false);

      return;
    }

    const matchesPointer = (evt: PointerEvent | MouseEvent) => {
      const { pointerTypes } = optionsRef.current;

      if (pointerTypes.length && evt instanceof PointerEvent) {
        return pointerTypes.includes(evt.pointerType as PointerType);
      }

      return true;
    };

    const handleEnter = (evt: PointerEvent | MouseEvent) => {
      if (!matchesPointer(evt)) return;

      const { enterDelay, onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      if (enterDelay > 0) {
        enterTimer.current = setTimeout(() => {
          setHovered(true);
          onChange?.(true);
        }, enterDelay);
      } else {
        setHovered(true);
        onChange?.(true);
      }
    };

    const handleLeave = (evt: PointerEvent | MouseEvent) => {
      if (!matchesPointer(evt)) return;

      const { leaveDelay, onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      if (leaveDelay > 0) {
        leaveTimer.current = setTimeout(() => {
          setHovered(false);
          onChange?.(false);
        }, leaveDelay);
      } else {
        setHovered(false);
        onChange?.(false);
      }
    };

    const handleFocus = () => {
      const { onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      setHovered(true);
      onChange?.(true);
    };

    const handleBlur = () => {
      const { onChange } = optionsRef.current;

      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      setHovered(false);
      onChange?.(false);
    };

    element.addEventListener(ENTER_EVENT, handleEnter);
    element.addEventListener(LEAVE_EVENT, handleLeave);

    if (includeFocus) {
      element.addEventListener(FOCUS_EVENT, handleFocus);
      element.addEventListener(BLUR_EVENT, handleBlur);
    }

    return () => {
      clearTimer(enterTimer);
      clearTimer(leaveTimer);

      element.removeEventListener(ENTER_EVENT, handleEnter);
      element.removeEventListener(LEAVE_EVENT, handleLeave);

      if (includeFocus) {
        element.removeEventListener(FOCUS_EVENT, handleFocus);
        element.removeEventListener(BLUR_EVENT, handleBlur);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef.current, optionsRef, disabled, includeFocus]);

  return hovered;
}
