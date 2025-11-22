import { useState, useCallback } from "react";

type MutationState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export function useMutation<TData = unknown, TVariables = unknown>(
  url: string,
  options?: {
    method?: string;
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
  }
) {
  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (variables?: TVariables) => {
      setState((prev) => ({ ...prev, loading: true, error: null, success: false }));

      try {
        const response = await fetch(url, {
          method: options?.method || "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: variables ? JSON.stringify(variables) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setState({
          data,
          loading: false,
          error: null,
          success: true,
        });

        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });

        options?.onError?.(errorMessage);
        throw error;
      }
    },
    [url, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}