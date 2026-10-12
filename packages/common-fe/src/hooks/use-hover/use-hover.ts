import { RefObject, useEffect, useState } from 'react';

import { useLatest } from '../use-latest.ts';

import { DEFAULT_POINTER_TYPES, ENTER_EVENT, LEAVE_EVENT } from './constants.ts';
import { PointerType, UseHoverOptions } from './types.ts';

export function useHover<T extends HTMLElement | SVGElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseHoverOptions = {}
): boolean {
  const { enterDelay = 0, leaveDelay = 0, disabled = false, pointerTypes = DEFAULT_POINTER_TYPES, onChange } = options;
  const optionsRef = useLatest({ enterDelay, leaveDelay, pointerTypes, onChange });

  const [element, setElement] = useState<GlobalEventHandlers | null>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useLatest(hovered);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- runs after every commit to pick up the element React attached to the ref
  useEffect(() => {
    setElement(targetRef.current);
  });

  useEffect(() => {
    // The previous run's cleanup has reset `hovered`.
    if (hoveredRef.current) {
      optionsRef.current.onChange?.(false);
    }

    if (!element || disabled) return;

    let enterTimer: number | undefined;
    let leaveTimer: number | undefined;

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

      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);

      if (enterDelay > 0) {
        enterTimer = setTimeout(() => {
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

      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);

      if (leaveDelay > 0) {
        leaveTimer = setTimeout(() => {
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
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);

      element.removeEventListener(ENTER_EVENT, handleEnter);
      element.removeEventListener(LEAVE_EVENT, handleLeave);

      setHovered(false);
    };
  }, [element, optionsRef, hoveredRef, disabled]);

  return hovered;
}
