"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, UserRound, LogOut } from "lucide-react";
import AppSidebar from "@/components/layout/AppSidebar";
import { apiRequest } from "@/lib/api";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isPublicRoute) {
      setUserLoading(false);
      return;
    }

    let active = true;

    async function loadUser() {
      setUserLoading(true);

      try {
        const response = await apiRequest<{
          success: boolean;
          user: CurrentUser;
        }>("/auth/me");

        if (active) {
          setUser(response.user);
        }
      } catch {
        if (active) {
          router.replace("/login");
        }
      } finally {
        if (active) {
          setUserLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [pathname, isPublicRoute, router]);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setError("");
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await apiRequest("/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-border bg-background/95 pl-16 pr-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              disabled={userLoading || loggingOut}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-wait disabled:opacity-70"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">
                  {userLoading ? "Loading..." : user?.name || "User"}
                </p>
                <p className="max-w-40 truncate text-xs text-muted-foreground">
                  {user?.email || "SkillSync Member"}
                </p>
              </div>

              <ChevronDown
                size={15}
                aria-hidden="true"
                className={`text-muted-foreground transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                aria-label="Account options"
                className="absolute right-0 top-14 z-50 w-60 rounded-xl border border-border bg-card p-2 shadow-2xl"
              >
                <div className="border-b border-border px-3 py-3">
                  <p className="truncate text-sm font-medium">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <UserRound size={16} aria-hidden="true" />
                  My Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-50"
                >
                  <LogOut size={16} aria-hidden="true" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>

                {error && (
                  <p role="alert" className="px-3 py-2 text-xs text-red-500">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
