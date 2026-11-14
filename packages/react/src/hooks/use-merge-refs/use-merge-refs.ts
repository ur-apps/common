import { Ref, RefCallback, useState } from 'react';

function mergeRefs<T>(refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node);

        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }

      if (ref) {
        ref.current = node;

        return () => {
          ref.current = null;
        };
      }

      return undefined;
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
    };
  };
}

/**
 * Custom hook that combines several refs into one ref callback, so one element can be passed to all of them.
 * The callback keeps its identity while the given refs stay the same.
 * Cleanup functions returned by callback refs are respected.
 *
 * @param refs - Refs to combine; `undefined` and `null` are skipped.
 * @returns A ref callback that sets every given ref.
 */
export function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  const [merged, setMerged] = useState(() => ({ refs, callback: mergeRefs(refs) }));
  const isChanged = refs.length !== merged.refs.length || refs.some((ref, index) => ref !== merged.refs[index]);

  if (isChanged) {
    const next = { refs, callback: mergeRefs(refs) };

    setMerged(next);

    return next.callback;
  }

  return merged.callback;
}
