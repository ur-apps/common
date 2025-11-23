# useDebounce Hook

A React hook that creates a debounced version of a callback function using the `debounce` utility from the `@ur-apps/common` package.

## Features

- 🚀 Uses the robust `debounce` function from `@ur-apps/common`
- 🔄 Automatically uses the latest callback without recreating the debounced function
- 🧹 Automatically cancels pending calls on unmount
- 📝 Full TypeScript support
- ⚙️ Supports all debounce options (leading, trailing, maxWait, signal)

## Usage

### Basic Usage

```tsx
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@ur-apps/common-fe';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // recommended to be memoized with useCallback, but not required
  const debouncedSearch = useDebounce((term: string) => {
    // This will only run 300ms after the user stops typing
    if (term) {
      searchAPI(term).then(setResults);
    } else {
      setResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
      <div>Results: {results.length}</div>
    </div>
  );
}
```

### Advanced Usage with Options

```tsx
import React, { useState } from 'react';
import { useDebounce } from '@ur-apps/common-fe';

function AdvancedComponent() {
  const [value, setValue] = useState('');

  const debouncedSave = useDebounce(
    (data: string) => {
      console.log('Saving:', data);
      // Save to API
    },
    500,
    {
      leading: false, // Don't call on the leading edge
      trailing: true, // Call on the trailing edge (default)
      maxWait: 2000, // Maximum time to wait before calling
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSave(newValue);
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleInputChange} placeholder="Type to auto-save..." />
      <button onClick={() => debouncedSave.cancel()}>Cancel Pending Save</button>
      <button onClick={() => debouncedSave.flush()}>Save Now</button>
      <div>Pending: {debouncedSave.pending() ? 'Yes' : 'No'}</div>
    </div>
  );
}
```

## API

### Parameters

- `callback: F` - The function to debounce
- `delay: number` - The delay in milliseconds to wait before calling the function
- `options?: DebounceOptions` - Optional configuration object

### Options

- `leading?: boolean` - Call on the leading edge (first call immediately). Default: `false`
- `trailing?: boolean` - Call on the trailing edge. Default: `true`
- `maxWait?: number` - Ensure call is not less than maxWait ms (gives throttle behavior)
- `signal?: AbortSignal` - AbortSignal to cancel the debounced function

### Returns

A debounced function with the following methods:

- `cancel()` - Cancel any pending debounced calls
- `flush()` - Immediately execute any pending debounced call
- `pending()` - Returns `true` if there is a pending call, `false` otherwise

## Debounce vs Throttle

### When to use Debounce (useDebounce)

Use debounce when you want to **delay execution** until after the user stops performing an action:

- **Search input** - Wait for user to finish typing
- **Form validation** - Validate after user stops editing
- **Auto-save** - Save after user stops making changes
- **Text input** - Process input after typing pauses

**Behavior**: If you call a debounced function 10 times within 300ms, it will execute **only once, 300ms after the last call**.

### When to use Throttle (useThrottle)

Use throttle when you want to **limit the rate** at which a function executes, ensuring it runs at most once per specified time period:

- **Scroll events** - Track scroll position without overwhelming performance
- **Mouse movement** - Track cursor position at a controlled rate
- **Window resize** - Update layout calculations periodically
- **Button clicks** - Prevent excessive API calls from rapid clicking
- **Animation updates** - Limit frame updates to a specific rate

**Behavior**: If you call a throttled function 10 times within 300ms, it will execute **immediately on the first call**, then **at most once more** after 300ms.

### Quick Comparison

| Feature                 | Throttle                  | Debounce                  |
| ----------------------- | ------------------------- | ------------------------- |
| **Execution frequency** | At most once per interval | Only after activity stops |
| **First call**          | Can execute immediately   | Usually waits             |
| **Use case**            | Rate limiting             | Delay until idle          |
| **Example**             | Scroll tracking           | Search input              |

## Implementation Details

The hook internally uses:

- `useMemo` to create a stable debounced function
- `useLatest` to ensure the callback always uses the most recent version
- `useEffect` cleanup to cancel pending calls on unmount
- The `debounce` function from `@ur-apps/common` for the core debouncing logic
