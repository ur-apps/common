# useHover Hook

A React hook that tracks the hover state of an element with advanced customization options including delays, pointer type filtering, and keyboard accessibility support.

## Features

- 🎯 Tracks hover state with ref-based element targeting
- ⏱️ Configurable enter/leave delays for better UX
- 🖱️ Pointer type filtering (mouse, pen, touch)
- ⌨️ Optional keyboard accessibility (focus/blur)
- 🔄 Automatic cleanup on unmount
- 📝 Full TypeScript support
- ♿ Accessibility-friendly with `includeFocus` option

## Usage

### Basic Usage

```tsx
import React, { useRef } from 'react';
import { useHover } from '@ur-apps/common-fe';

function BasicHoverComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isHovered = useHover(buttonRef);

  return (
    <button
      ref={buttonRef}
      style={{
        backgroundColor: isHovered ? 'lightblue' : 'white',
        padding: '10px 20px',
        border: '1px solid #ccc',
      }}>
      {isHovered ? 'Hovering!' : 'Hover over me'}
    </button>
  );
}
```

### With Delays

```tsx
import React, { useRef } from 'react';
import { useHover } from '@ur-apps/common-fe';

function TooltipComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(elementRef, {
    enterDelay: 500, // Wait 500ms before showing tooltip
    leaveDelay: 200, // Wait 200ms before hiding tooltip
  });

  return (
    <div ref={elementRef} style={{ position: 'relative', display: 'inline-block' }}>
      <span>Hover over me</span>
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}>
          This is a tooltip!
        </div>
      )}
    </div>
  );
}
```

### With onChange Callback

```tsx
import React, { useRef, useState } from 'react';
import { useHover } from '@ur-apps/common-fe';

function ImagePreviewComponent() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [hoverCount, setHoverCount] = useState(0);

  const isHovered = useHover(imageRef, {
    onChange: (hovered) => {
      console.log('Hover state changed:', hovered);
      if (hovered) {
        setHoverCount((prev) => prev + 1);
      }
    },
  });

  return (
    <div>
      <img
        ref={imageRef}
        src="/path/to/image.jpg"
        alt="Hover me"
        style={{
          border: isHovered ? '3px solid blue' : '1px solid gray',
          transition: 'border 0.2s',
        }}
      />
      <p>Hover count: {hoverCount}</p>
    </div>
  );
}
```

### With Keyboard Accessibility

```tsx
import React, { useRef } from 'react';
import { useHover } from '@ur-apps/common-fe';

function AccessibleCardComponent() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(cardRef, {
    includeFocus: true, // Also activate on keyboard focus
  });

  return (
    <div
      ref={cardRef}
      tabIndex={0} // Make focusable for keyboard navigation
      style={{
        padding: '20px',
        border: '2px solid',
        borderColor: isHovered ? 'blue' : 'gray',
        backgroundColor: isHovered ? '#f0f8ff' : 'white',
        cursor: 'pointer',
        outline: 'none',
      }}>
      <h3>Accessible Card</h3>
      <p>Hover with mouse or focus with keyboard (Tab key)</p>
      {isHovered && <p>✓ Currently active</p>}
    </div>
  );
}
```

### Pointer Type Filtering

```tsx
import React, { useRef } from 'react';
import { useHover } from '@ur-apps/common-fe';

function TouchExcludedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  // Only respond to mouse and pen, not touch
  const isHovered = useHover(elementRef, {
    pointerTypes: ['mouse', 'pen'], // Default: excludes touch
  });

  return (
    <div
      ref={elementRef}
      style={{
        padding: '20px',
        backgroundColor: isHovered ? 'lightgreen' : 'lightgray',
      }}>
      This only responds to mouse/pen hover, not touch
    </div>
  );
}

function TouchIncludedComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  // Respond to all pointer types including touch
  const isHovered = useHover(elementRef, {
    pointerTypes: ['mouse', 'pen', 'touch'],
  });

  return (
    <div
      ref={elementRef}
      style={{
        padding: '20px',
        backgroundColor: isHovered ? 'lightcoral' : 'lightgray',
      }}>
      This responds to mouse, pen, AND touch
    </div>
  );
}
```

### Conditional Disabling

```tsx
import React, { useRef, useState } from 'react';
import { useHover } from '@ur-apps/common-fe';

function ConditionalHoverComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const isHovered = useHover(buttonRef, {
    disabled: isDisabled, // Disable hover tracking when button is disabled
  });

  return (
    <div>
      <button
        ref={buttonRef}
        disabled={isDisabled}
        style={{
          padding: '10px 20px',
          backgroundColor: isHovered ? 'lightblue' : 'white',
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}>
        {isHovered ? 'Hovering!' : 'Button'}
      </button>
      <br />
      <label>
        <input type="checkbox" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} />
        Disable button
      </label>
    </div>
  );
}
```

### Advanced: Dropdown Menu

```tsx
import React, { useRef, useState } from 'react';
import { useHover } from '@ur-apps/common-fe';

function DropdownMenu() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isTriggerHovered = useHover(triggerRef, {
    enterDelay: 200,
    leaveDelay: 300,
  });

  const isMenuHovered = useHover(menuRef, {
    leaveDelay: 300,
  });

  const showMenu = isTriggerHovered || isMenuHovered;

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        style={{
          padding: '10px 20px',
          backgroundColor: showMenu ? '#007bff' : '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}>
        Menu ▼
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
          }}>
          <div style={{ padding: '8px 12px', cursor: 'pointer' }}>Item 1</div>
          <div style={{ padding: '8px 12px', cursor: 'pointer' }}>Item 2</div>
          <div style={{ padding: '8px 12px', cursor: 'pointer' }}>Item 3</div>
        </div>
      )}
    </div>
  );
}
```

## API

### Parameters

```typescript
useHover<T extends HTMLElement = HTMLElement>(
  targetRef: RefObject<T | null>,
  options?: UseHoverOptions
): boolean
```

- `targetRef: RefObject<T | null>` - React ref to the target element to track
- `options?: UseHoverOptions` - Optional configuration object

### Options

```typescript
type UseHoverOptions = {
  enterDelay?: number; // Default: 0
  leaveDelay?: number; // Default: 0
  disabled?: boolean; // Default: false
  includeFocus?: boolean; // Default: false
  pointerTypes?: PointerType[]; // Default: ['mouse', 'pen']
  onChange?: (hovered: boolean) => void;
};

type PointerType = 'mouse' | 'pen' | 'touch';
```

#### Option Details

- **`enterDelay`** - Delay in milliseconds before setting hovered to `true`. Useful for tooltips that shouldn't appear instantly.
- **`leaveDelay`** - Delay in milliseconds before setting hovered to `false`. Prevents flickering when mouse briefly leaves element.

- **`disabled`** - When `true`, disables hover tracking, removes event listeners, and sets hovered to `false`.

- **`includeFocus`** - When `true`, also tracks focus/blur events for keyboard accessibility. Essential for accessible interactive elements.

- **`pointerTypes`** - Array of pointer types to respond to:
  - `['mouse', 'pen']` (default) - Desktop/stylus only
  - `['mouse', 'pen', 'touch']` - Include touch devices
  - `['mouse']` - Mouse only

- **`onChange`** - Callback function called whenever hover state changes. Receives the new hover state as argument.

### Returns

`boolean` - Current hover state (`true` when hovered, `false` otherwise)

## Use Cases

### When to use `useHover`

- **Tooltips** - Show additional information on hover
- **Preview cards** - Display expanded content on hover
- **Image galleries** - Show controls or overlays on hover
- **Navigation menus** - Dropdown or mega menus
- **Interactive buttons** - Visual feedback for user interactions
- **Data visualizations** - Highlight chart elements on hover
- **Card animations** - Scale, lift, or transform on hover

### Common Patterns

#### 1. Delayed Tooltips

```tsx
const isHovered = useHover(ref, {
  enterDelay: 700, // Don't show immediately
  leaveDelay: 100, // Hide quickly
});
```

#### 2. Sticky Hover (for complex interactions)

```tsx
const isHovered = useHover(ref, {
  enterDelay: 0, // Show immediately
  leaveDelay: 500, // Keep visible longer
});
```

#### 3. Keyboard Accessible Elements

```tsx
const isActive = useHover(ref, {
  includeFocus: true, // Activate on Tab key focus
});
```

#### 4. Touch-Friendly (Mobile)

```tsx
const isHovered = useHover(ref, {
  pointerTypes: ['mouse', 'pen', 'touch'], // Include touch
});
```

#### 5. Analytics Tracking

```tsx
const isHovered = useHover(ref, {
  onChange: (hovered) => {
    if (hovered) {
      trackEvent('element_hovered');
    }
  },
});
```

## Implementation Details

The hook internally:

- Uses `useLatest` to ensure options always use the most recent values without recreating event handlers
- Automatically detects `PointerEvent` support and falls back to `MouseEvent`
- Manages enter/leave timers with automatic cleanup
- Clears all timers when element becomes disabled or unmounted
- Filters events based on `pointerType` when using `PointerEvent` API

## Performance Considerations

- Event listeners are only attached when element exists and is not disabled
- Timers are properly cleaned up to prevent memory leaks
- Options changes don't recreate event handlers (thanks to `useLatest`)
- The hook automatically handles element changes via ref updates

## Accessibility Notes

- Use `includeFocus: true` for interactive elements to support keyboard navigation
- Ensure focused elements have visible focus indicators (outline)
- Add `tabIndex={0}` to make non-interactive elements keyboard-focusable
- Consider ARIA attributes (`aria-haspopup`, `aria-expanded`) for dropdowns
- Avoid relying solely on hover for critical functionality (think mobile/touch users)

## Browser Compatibility

- **Modern browsers**: Full support with `PointerEvent` API
- **Legacy browsers**: Automatic fallback to `MouseEvent` API
- **Touch devices**: Configurable via `pointerTypes` option
- **Keyboard navigation**: Supported via `includeFocus` option
