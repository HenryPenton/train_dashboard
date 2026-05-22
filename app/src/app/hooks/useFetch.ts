import { useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  error: string | null;
  resolvedUrl: string | null;
};

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    resolvedUrl: null,
  });

  useEffect(() => {
    if (!url) {
      return;
    }

    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json() as Promise<T>;
      })
      .then((data) => {
        if (!abortController.signal.aborted) {
          setState({ data, error: null, resolvedUrl: url });
        }
      })
      .catch((error: unknown) => {
        if (
          error instanceof Error &&
          error.name !== "AbortError" &&
          !abortController.signal.aborted
        ) {
          setState({ data: null, error: error.message, resolvedUrl: url });
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  if (!url) {
    return { data: null, loading: false, error: null };
  }

  const hasResolvedCurrentUrl = state.resolvedUrl === url;

  return {
    data: state.data,
    loading: !hasResolvedCurrentUrl,
    error: hasResolvedCurrentUrl ? state.error : null,
  };
}
