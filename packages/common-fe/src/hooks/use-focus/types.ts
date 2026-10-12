export type UseFocusOptions = {
  /**
   * Disable the hook (removes focus and handlers)
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback on state change
   */
  onChange?: (focused: boolean) => void;
};
