import { useId } from 'react';

/**
 * Custom hook that returns the provided name or a fallback name.
 *
 * @param name - Optional name to be used.
 * @returns The provided name if available, otherwise a fallback name.
 */
export function useName(name?: string): string {
  const fallbackId = useId();

  return name ?? fallbackId;
}
