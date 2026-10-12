export type UseFocusOptions = {
  /**
   * Disable the hook (removes focus and handlers)
   * @default false
   */
  disabled?: boolean;
  /**
   * Only count focus that matches `:focus-visible` (e.g. keyboard focus, not a mouse click)
   * @default false
   */
  visibleOnly?: boolean;
  /**
   * Callback on state change
   */
  onChange?: (focused: boolean) => void;
};
