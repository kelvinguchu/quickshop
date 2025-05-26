import { useState, useEffect } from "react";

interface CSRFState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useCSRF() {
  const [state, setState] = useState<CSRFState>({
    token: null,
    isLoading: true,
    error: null,
  });

  const fetchCSRFToken = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/csrf-token", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();

      setState({
        token: data.csrfToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      setState({
        token: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  useEffect(() => {
    fetchCSRFToken();
  }, []);

  return {
    ...state,
    refetch: fetchCSRFToken,
  };
}
