import { useEffect, useState, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (fetchUrl: string, signal: AbortSignal) => {
    try {
      const response = await fetch(fetchUrl, { signal });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!signal.aborted) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError" && !signal.aborted) {
        setState({ data: null, loading: false, error: error.message });
      }
    }
  }, []);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const abortController = new AbortController();
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    fetchData(url, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [url, fetchData]);

  return state;
}