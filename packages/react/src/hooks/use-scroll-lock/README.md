# useScrollLock Hook

A React hook that prevents the page from scrolling while enabled, for modals, drawers and other overlays.

## Features

- 🔒 Locks the page scroll by hiding the overflow of the root element
- 🧮 Nested locks are counted: the page is unlocked only when the last lock is released
- 📐 The space of a visible scrollbar stays reserved, so the page layout does not shift
- ♻️ Restores the previous inline styles of the root element on unlock
- 📝 Full TypeScript support

## Usage

### Modal

```tsx
import React from 'react';
import { useFlag, useScrollLock } from '@urapps/react';

function ModalExample() {
  const [isOpen, setIsOpen, toggle] = useFlag(false);

  useScrollLock(isOpen);

  return (
    <div>
      <button onClick={toggle}>Open</button>

      {isOpen && (
        <div className="modal">
          <p>The page behind this modal does not scroll.</p>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### Nested Overlays

```tsx
function Drawer({ open }: { open: boolean }) {
  useScrollLock(open);
  // ...
}

function ConfirmDialog({ open }: { open: boolean }) {
  useScrollLock(open);
  // ...
}

// With both open, closing the dialog keeps the page locked until the drawer closes too.
```

## API

### Parameters

```typescript
useScrollLock(enabled: boolean): void
```

- `enabled: boolean` - Whether the page scroll should be locked. The lock is released when it becomes `false` or the component unmounts.

## Implementation Details

On the first lock the hook:

- Saves the inline `overflow` and `scrollbar-gutter` of `<html>`
- Sets `overflow: hidden` on `<html>`
- Sets `scrollbar-gutter: stable` on `<html>` if a scrollbar is visible (`window.innerWidth > document.documentElement.clientWidth`)

When the last lock is released, the saved inline values are restored.

## Limitations

- Only the document scroll is locked; scroll containers inside the page keep scrolling.
- Changes to the inline `overflow` or `scrollbar-gutter` of `<html>` made while the page is locked are overwritten on unlock.
- The lock counter lives in the module, so two copies of the package in one bundle keep separate counters.
