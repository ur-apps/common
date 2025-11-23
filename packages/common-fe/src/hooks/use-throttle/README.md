# useThrottle Hook

A React hook that creates a throttled version of a callback function using the `throttle` utility from the `@ur-apps/common` package.

## Features

- 🚀 Uses the robust `throttle` function from `@ur-apps/common`
- 🔄 Automatically uses the latest callback without recreating the throttled function
- 🧹 Automatically cancels pending calls on unmount
- 📝 Full TypeScript support
- ⚙️ Supports all throttle options (leading, trailing, signal)

## Usage

### Basic Usage

```tsx
import React, { useState } from 'react';
import { useThrottle } from '@ur-apps/common-fe';

function ScrollComponent() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // recommended to be memoized with useCallback, but not required
  const throttledScroll = useThrottle(() => {
    // This will run at most once every 300ms
    setScrollPosition(window.scrollY);
    console.log('Scroll position:', window.scrollY);
  }, 300);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return (
    <div>
      <div style={{ position: 'fixed', top: 0 }}>Scroll Position: {scrollPosition}px</div>
      <div style={{ height: '3000px' }}>Scroll down...</div>
    </div>
  );
}
```

### Window Resize Example

```tsx
import React, { useEffect, useState } from 'react';
import { useThrottle } from '@ur-apps/common-fe';

function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const throttledResize = useThrottle(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 200);

  useEffect(() => {
    window.addEventListener('resize', throttledResize);
    return () => window.removeEventListener('resize', throttledResize);
  }, [throttledResize]);

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### Advanced Usage with Options

```tsx
import React, { useState } from 'react';
import { useThrottle } from '@ur-apps/common-fe';

function MouseTrackerComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const throttledMouseMove = useThrottle(
    (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      console.log('Mouse position updated:', event.clientX, event.clientY);
    },
    100,
    {
      leading: true, // Call immediately on first event
      trailing: true, // Also call on the trailing edge (default)
    }
  );

  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      throttledMouseMove.cancel(); // Cancel any pending calls
    };
  }, [throttledMouseMove]);

  return (
    <div>
      <div>
        Mouse position: X={position.x}, Y={position.y}
      </div>
      <button onClick={() => throttledMouseMove.cancel()}>Cancel Pending</button>
      <button onClick={() => throttledMouseMove.flush()}>Execute Now</button>
      <div>Pending: {throttledMouseMove.pending() ? 'Yes' : 'No'}</div>
    </div>
  );
}
```

### API Call Throttling

```tsx
import React, { useState } from 'react';
import { useThrottle } from '@ur-apps/common-fe';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const throttledSearch = useThrottle(
    (term: string) => {
      // This will run at most once every 500ms, even if user types faster
      if (term) {
        searchAPI(term).then(setResults);
      } else {
        setResults([]);
      }
    },
    500,
    { leading: false, trailing: true }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    throttledSearch(newValue);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Search (throttled)..." />
      <div>Results: {results.length}</div>
    </div>
  );
}
```

## API

### Parameters

- `callback: F` - The function to throttle
- `delay: number` - The delay in milliseconds to wait before allowing the next call
- `options?: ThrottleOptions` - Optional configuration object

### Options

- `leading?: boolean` - Call on the leading edge (first call immediately). Default: `true`
- `trailing?: boolean` - Call on the trailing edge. Default: `true`
- `signal?: AbortSignal` - AbortSignal to cancel the throttled function

### Returns

A throttled function with the following methods:

- `cancel()` - Cancel any pending throttled calls
- `flush()` - Immediately execute any pending throttled call
- `pending()` - Returns `true` if there is a pending call, `false` otherwise

## Throttle vs Debounce

### When to use Throttle (useThrottle)

Use throttle when you want to **limit the rate** at which a function executes, ensuring it runs at most once per specified time period:

- **Scroll events** - Track scroll position without overwhelming performance
- **Mouse movement** - Track cursor position at a controlled rate
- **Window resize** - Update layout calculations periodically
- **Button clicks** - Prevent excessive API calls from rapid clicking
- **Animation updates** - Limit frame updates to a specific rate

**Behavior**: If you call a throttled function 10 times within 300ms, it will execute **immediately on the first call**, then **at most once more** after 300ms.

### When to use Debounce (useDebounce)

Use debounce when you want to **delay execution** until after the user stops performing an action:

- **Search input** - Wait for user to finish typing
- **Form validation** - Validate after user stops editing
- **Auto-save** - Save after user stops making changes
- **Text input** - Process input after typing pauses

**Behavior**: If you call a debounced function 10 times within 300ms, it will execute **only once, 300ms after the last call**.

### Quick Comparison

| Feature                 | Throttle                  | Debounce                  |
| ----------------------- | ------------------------- | ------------------------- |
| **Execution frequency** | At most once per interval | Only after activity stops |
| **First call**          | Can execute immediately   | Usually waits             |
| **Use case**            | Rate limiting             | Delay until idle          |
| **Example**             | Scroll tracking           | Search input              |

## Implementation Details

The hook internally uses:

- `useMemo` to create a stable throttled function
- `useLatest` to ensure the callback always uses the most recent version
- `useEffect` cleanup to cancel pending calls on unmount
- The `throttle` function from `@ur-apps/common` for the core throttling logic

## Performance Considerations

- The throttled function is only recreated when `delay` or options change
- Callback updates don't recreate the throttled function (thanks to `useLatest`)
- Automatic cleanup prevents memory leaks on component unmount
- No need to manually cancel in most cases
