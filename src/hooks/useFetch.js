import { useState, useEffect, useCallback, useRef } from "react";

export const useFetch = (fetchFn, deps = [], options = {}) => {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(...args);
        if (isMounted.current) {
          setData(result);
          onSuccess?.(result);
        }
        return result;
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || "An error occurred");
          onError?.(err);
        }
        throw err;
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...deps],
  );

  useEffect(() => {
    if (immediate) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};
