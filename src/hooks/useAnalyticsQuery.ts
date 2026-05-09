import { useEffect, useRef, useState } from "react";

export function useAnalyticsQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fnRef = useRef(queryFn);

  useEffect(() => {
    fnRef.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      setLoading(true);

      const result = await fnRef.current();

      if (mounted) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mounted) setError(err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  load();

  return () => {
    mounted = false;
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [...deps]);

  return { data, loading, error };
}