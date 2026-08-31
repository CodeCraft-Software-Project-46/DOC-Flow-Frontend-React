import { useEffect, useRef, useState } from "react";

export function useAnalyticsQuery<T>( //query function that returns a promise of type T, and an optional dependency array
  queryFn: () => Promise<T>, //T means generic type in TypeScript
  deps: unknown[] = [] //dependency array for useEffect, default is empty array
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const queryRef = useRef(queryFn);//Stores the latest query function

  useEffect(() => {
    queryRef.current = queryFn; //whenever queryFn changes update the ref
  }, [queryFn]);

  useEffect(() => {
    let isMounted = true;  //React component is currently existing on the screen

    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await queryRef.current(); //Calls API function

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
      isMounted = false; //Runs when component unmounts
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