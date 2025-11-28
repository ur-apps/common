# useFlag Hook

A React hook for managing boolean flag state with a built-in toggle function. Provides a simple and clean interface for on/off state management.

## Features

- 🎯 Simple boolean state management
- 🔄 Built-in toggle function with stable reference
- 📝 Full TypeScript support
- 🪶 Lightweight with no dependencies
- ⚡ Memoized toggle function for optimal performance
- 🎨 Clean API with tuple destructuring

## Usage

### Basic Usage

```tsx
import React from 'react';
import { useFlag } from '@ur-apps/common-fe';

function BasicExample() {
  const [isOpen, setIsOpen, toggleIsOpen] = useFlag(); // default value is false

  return (
    <div>
      <p>Modal is {isOpen ? 'open' : 'closed'}</p>
      <button onClick={toggleIsOpen}>Toggle Modal</button>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <button onClick={() => setIsOpen(false)}>Close Modal</button>
    </div>
  );
}
```

### Modal Component

```tsx
import React from 'react';
import { useFlag } from '@ur-apps/common-fe';

function ModalExample() {
  const [isOpen, setIsOpen, toggle] = useFlag(false);

  return (
    <div>
      <button onClick={toggle}>Open Settings</button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Settings</h2>
            <p>Your settings content here...</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
          <div className="modal-backdrop" onClick={toggle} />
        </div>
      )}
    </div>
  );
}
```

### Loading States

```tsx
import React, { useEffect } from 'react';
import { useFlag } from '@ur-apps/common-fe';

function LoadingExample() {
  const [isLoading, setIsLoading] = useFlag(false);
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Lazy Initialization

```tsx
import React from 'react';
import { useFlag } from '@ur-apps/common-fe';

function LazyInitExample() {
  // Initialize from localStorage with lazy initialization
  const [isEnabled, setIsEnabled, toggleIsEnabled] = useFlag(() => {
    const saved = localStorage.getItem('feature-enabled');
    return saved === 'true';
  });

  // Save to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem('feature-enabled', String(isEnabled));
  }, [isEnabled]);

  return (
    <div>
      <label>
        <input type="checkbox" checked={isEnabled} onChange={toggleIsEnabled} />
        Enable Feature (persisted)
      </label>
    </div>
  );
}
```

## API

### Parameters

```typescript
useFlag(initialState?: boolean | (() => boolean)): readonly [boolean, Dispatch<SetStateAction<boolean>>, () => void]
```

- `initialState?: boolean | (() => boolean)` - The initial state of the flag. Can be:
  - A boolean value: `true` or `false`
  - A function that returns a boolean (for lazy initialization)
  - Default: `false`

### Returns

A readonly tuple with three elements:

```typescript
[
  flag: boolean,                            // Current flag state
  setFlag: Dispatch<SetStateAction<boolean>>, // Function to set flag directly
  toggle: () => void                         // Function to toggle flag
]
```

#### Return Values

1. **`flag: boolean`** - The current state of the flag
2. **`setFlag: Dispatch<SetStateAction<boolean>>`** - Direct setter function (same as React's `useState` setter)
   - Can accept a boolean value: `setFlag(true)`
   - Can accept a function: `setFlag(prev => !prev)`

3. **`toggle: () => void`** - Convenience function that toggles the flag state
   - Memoized with `useCallback` for stable reference
   - Equivalent to: `setFlag(prev => !prev)`

## Use Cases

### When to use `useFlag`

- **Modals & Dialogs** - Show/hide modal windows
- **Drawers & Sidebars** - Toggle navigation drawers
- **Accordions** - Expand/collapse content sections
- **Dropdowns** - Open/close dropdown menus
- **Visibility toggles** - Show/hide passwords, content, details
- **Feature flags** - Enable/disable features
- **Loading states** - Track loading/processing states
- **Form states** - Track form submission, validation states
- **UI preferences** - Dark mode, compact view, etc.

### Common Patterns

#### 1. Modal Control

```tsx
const [isOpen, setIsOpen, toggle] = useFlag(false);
// Open: setIsOpen(true)
// Close: setIsOpen(false)
// Toggle: toggle()
```

#### 2. Checkbox Binding

```tsx
const [isChecked, , toggle] = useFlag(false);
<input type="checkbox" checked={isChecked} onChange={toggle} />;
```

#### 3. Conditional Rendering

```tsx
const [showContent, , toggle] = useFlag(false);
{
  showContent && <div>Content</div>;
}
```

#### 4. Loading State

```tsx
const [isLoading, setIsLoading] = useFlag(false);
// Start: setIsLoading(true)
// Done: setIsLoading(false)
```

#### 5. Feature Flag

```tsx
const [isFeatureEnabled, setIsFeatureEnabled] = useFlag(() => {
  return localStorage.getItem('feature') === 'true';
});
```

## Comparison with useState

### Using `useState`

```tsx
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen((prev) => !prev);

// Need to define toggle function manually
// Toggle function recreated on every render (unless useCallback)
```

### Using `useFlag`

```tsx
const [isOpen, setIsOpen, toggle] = useFlag(false);

// Toggle function built-in and memoized
// Cleaner API for boolean states
// Consistent naming pattern
```

## Implementation Details

The hook internally:

- Uses React's `useState` for state management
- Uses `useCallback` to memoize the toggle function with an empty dependency array
- Returns a readonly tuple using `as const` for proper type inference
- Supports lazy initialization via function initializer

## Performance Considerations

- The toggle function is memoized and has a stable reference across renders
- No unnecessary re-renders caused by the toggle function
- Minimal overhead compared to plain `useState`
- Safe to use in dependency arrays (toggle function reference never changes)
