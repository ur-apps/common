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
- `signal?: AbortSignal` - AbortSignal to cancel the throttled function

### Returns

A debounced function with the following methods:

- `cancel()` - Cancel any pending debounced calls
- `flush()` - Immediately execute any pending debounced call
- `pending()` - Returns `true` if there is a pending call, `false` otherwise

## Implementation Details

The hook internally uses:

- `useMemo` to create a stable debounced function
- `useLatest` to ensure the callback always uses the most recent version
- `useEffect` cleanup to cancel pending calls on unmount
- The `debounce` function from `@ur-apps/common` for the core debouncing logic
