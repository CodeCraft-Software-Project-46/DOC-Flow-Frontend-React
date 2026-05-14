import { useEffect, useRef, useState } from "react";

export function useAnalyticsQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const queryRef = useRef(queryFn);

  useEffect(() => {
    queryRef.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    let isMounted = true;  //React component is currently existing on the screen

    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await queryRef.current();

        if (!isMounted) return; 

        setData(result);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        setError(err);
        setData(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };

    // queryFn handled using useRef intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
  };
}