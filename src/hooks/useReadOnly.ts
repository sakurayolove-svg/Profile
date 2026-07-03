import { useMemo } from 'react';

export function useReadOnly() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('readonly') || params.has('view') || params.get('mode') === 'readonly';
  }, []);
}
