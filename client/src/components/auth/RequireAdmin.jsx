import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authKeys, logout } from "../../api/auth";
import { Button } from "../ui/button";

export function RequireAdmin() {
  const { isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const clearAuthCache = () => {
    queryClient.cancelQueries();
    queryClient.clear();
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuthCache();
      navigate("/signin", { replace: true });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg">
          <p className="text-base font-semibold text-slate-900">
            Admin access required
          </p>
          <p className="text-sm text-slate-600">
            This area is restricted to admin accounts. Please sign in with an admin
            profile or contact your administrator for access.
          </p>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Signing out..." : "Use a different account"}
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

