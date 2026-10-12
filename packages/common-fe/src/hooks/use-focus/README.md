# useFocus Hook

A React hook that tracks whether an element has focus, with an option to count only keyboard (`:focus-visible`) focus.

## Features

- 🎯 Tracks focus state with ref-based element targeting
- ⌨️ Optional `:focus-visible` filtering to ignore focus from mouse clicks
- 🔄 Automatic cleanup on unmount
- 📝 Full TypeScript support

## Usage

### Basic Usage

```tsx
import React, { useRef } from 'react';
import { useFocus } from '@urapps/common-fe';

function FocusableInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocused = useFocus(inputRef);

  return <input ref={inputRef} style={{ borderColor: isFocused ? 'blue' : 'gray' }} />;
}
```

### Keyboard Focus Only

```tsx
import React, { useRef } from 'react';
import { useFocus } from '@urapps/common-fe';

function SaveButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isKeyboardFocused = useFocus(buttonRef, { visibleOnly: true });

  return (
    <div>
      <button ref={buttonRef}>Save</button>
      {isKeyboardFocused && <span>Press Enter to save</span>}
    </div>
  );
}
```

### Tooltip on Hover or Keyboard Focus

```tsx
import React, { useRef } from 'react';
import { useFocus, useHover } from '@urapps/common-fe';

function InfoButton() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hovered = useHover(triggerRef, { enterDelay: 300 });
  const focused = useFocus(triggerRef, { visibleOnly: true });

  return (
    <span style={{ position: 'relative' }}>
      <button ref={triggerRef}>Info</button>
      {(hovered || focused) && <span role="tooltip">More details</span>}
    </span>
  );
}
```

## API

### Parameters

```typescript
useFocus<T extends HTMLElement | SVGElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options?: UseFocusOptions
): boolean
```

- `targetRef: RefObject<T | null>` - React ref to the target element to track
- `options?: UseFocusOptions` - Optional configuration object

### Options

```typescript
type UseFocusOptions = {
  disabled?: boolean; // Default: false
  visibleOnly?: boolean; // Default: false
  onChange?: (focused: boolean) => void;
};
```

#### Option Details

- **`disabled`** - When `true`, disables focus tracking, removes event listeners, and sets focused to `false` (calling `onChange(false)` if it was `true`).
- **`visibleOnly`** - When `true`, only focus that matches `:focus-visible` counts (keyboard focus, not a mouse click). Useful for tooltips that should open on Tab but not stay open after a click.
- **`onChange`** - Callback function called whenever focus state changes. Receives the new focus state as argument. Not called on unmount.

### Returns

`boolean` - Current focus state (`true` when focused, `false` otherwise)

## Limitations

- Only focus on the target element itself counts; focus on its descendants does not.
- The element must be attached to the ref when the hook mounts; an element rendered later is not picked up.
- With `visibleOnly`, `:focus-visible` is checked when the element receives focus; switching to the keyboard after a mouse click is not picked up.
