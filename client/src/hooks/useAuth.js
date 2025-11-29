import { useQuery } from "@tanstack/react-query";
import { authKeys, fetchCurrentUser } from "../api/auth";

export function useAuth() {
  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    user: query.data?.user ?? null,
    isAuthenticated: Boolean(query.data?.user),
  };
}

