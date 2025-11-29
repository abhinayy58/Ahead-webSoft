import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleRedirect() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Preparing your workspace...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const target = user.role === "admin" ? "/create" : "/forms";
  return <Navigate to={target} replace />;
}

