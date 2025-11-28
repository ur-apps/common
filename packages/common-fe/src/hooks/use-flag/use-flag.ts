import { Dispatch, SetStateAction, useCallback, useState } from 'react';

/**
 * A custom React hook for managing boolean flag state with a built-in toggle function.
 *
 * This hook provides a simple interface for boolean state management, commonly used for
 * toggles, modals, drawers, visibility states, and other on/off scenarios.
 *
 * @param initialState - The initial state of the flag. Can be a boolean value or a function that returns a boolean.
 * @returns A tuple containing:
 *   - [0]: The current flag state (boolean)
 *   - [1]: Function to set the flag state directly
 *   - [2]: Function to toggle the flag state
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen, toggleIsOpen] = useFlag(false);
 *
 * // Toggle the flag
 * toggleIsOpen();
 *
 * // Set directly
 * setIsOpen(true);
 * ```
 */
export function useFlag(
  initialState: boolean | (() => boolean) = false
): [boolean, Dispatch<SetStateAction<boolean>>, () => void] {
  const [flag, setFlag] = useState(initialState);

  const toggle = useCallback(() => {
    setFlag((prev) => !prev);
  }, []);

  return [flag, setFlag, toggle];
}
