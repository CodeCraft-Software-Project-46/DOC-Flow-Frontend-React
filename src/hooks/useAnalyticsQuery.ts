import { useEffect, useState } from "react";

/**
 * Generic hook for analytics widgets
 * WHY: removes duplicate loading/error/fetch logic from every widget
 */
export function useAnalyticsQuery<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await apiCall();

        // WHY: prevent memory leaks if component unmounts
        if (mounted) setData(res);
      } catch (error) {
        console.error("Analytics query failed:", error);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [apiCall]);

  return { data, loading, error };
}