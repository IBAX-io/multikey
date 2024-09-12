import { useCallback, useEffect, useRef } from 'react';
export interface UseRefParams {
  fn: (_args: any) => void;
  timer: ReturnType<typeof setTimeout> | null;
}
// React anti shake function
export const useDebounce = (fn: (_args: any) => void, delay = 1000) => {
  const { current } = useRef<UseRefParams>({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [current, fn]);
  return useCallback(
    (args: any) => {
      console.log('🚀 ~ file: index.tsx:14 ~ useDebounce ~ args:', args);
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn(args);
      }, delay);
    },
    [current, delay]
  );
};
// React throttling function
export const useThrottle = (fn: (_args: any) => void, delay = 1000) => {
  const { current } = useRef<UseRefParams>({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [current, fn]
  );
  return useCallback(
    function f(args: any) {
      if (!current.timer) {
        current.timer = setTimeout(() => {
          current.timer = null;
        }, delay);
        current.fn(args);
      }
    },
    [current, delay]
  );
};
