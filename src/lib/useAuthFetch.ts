import { useAuth } from "@clerk/react";
import { useCallback } from "react";

/**
 * Hook qui retourne une fonction fetch enrichie avec le JWT Clerk.
 * Utilisation : const authFetch = useAuthFetch();
 *               await authFetch("/api/audit", { method: "POST", ... })
 */
export function useAuthFetch() {
  const { getToken } = useAuth();

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = await getToken();

      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers ?? {}),
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getToken]
  );

  return authFetch;
}
