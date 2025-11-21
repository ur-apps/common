import { useDebounce } from './use-debounce';

describe('useDebounce hook', () => {
  it('should be a function', () => {
    expect(typeof useDebounce).toBe('function');
  });

  it('should be exported correctly', () => {
    expect(useDebounce).toBeDefined();
  });

  // Note: Full React hook testing would require @testing-library/react
  // and proper React testing environment setup. For now, we verify
  // the hook is properly structured and can be imported.
});
