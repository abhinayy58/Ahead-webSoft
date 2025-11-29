import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buttonVariants, Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { authKeys, logout } from "../../api/auth";

const adminLinks = [
  { to: "/create", label: "Create" },
  { to: "/myforms", label: "Forms" },
  { to: "/forms", label: "Preview" },
];

const userLinks = [{ to: "/forms", label: "Forms" }];

export function AppShell({ children }) {
  const { user } = useAuth();
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

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              Ahead WebSoft
            </p>
          </div>
          <nav className="flex gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: isActive ? "default" : "ghost",
                      size: "sm",
                    })
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {user.role}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

