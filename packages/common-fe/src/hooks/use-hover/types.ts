export type PointerType = 'mouse' | 'pen' | 'touch';

export type UseHoverOptions = {
  /**
   * Delay before setting hovered to true (ms)
   * @default 0
   */
  enterDelay?: number;
  /**
   * Delay before setting hovered to false (ms)
   * @default 0
   */
  leaveDelay?: number;
  /**
   * Disable the hook (removes hover and handlers)
   * @default false
   */
  disabled?: boolean;
  /**
   * Also trigger on focus/blur (for keyboard accessibility)
   * @default false
   */
  includeFocus?: boolean;
  /**
   * Limit pointer types considered as hover
   * @default ['mouse', 'pen']
   */
  pointerTypes?: PointerType[];
  /**
   * Callback on state change
   */
  onChange?: (hovered: boolean) => void;
};
