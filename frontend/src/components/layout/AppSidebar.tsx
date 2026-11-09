"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Code2,
  Target,
  Activity,
  UserRound,
  Settings,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Skills", href: "/skills", icon: Code2 },
  { name: "Job Analyzer", href: "/analyzer", icon: Target },
  { name: "Analysis History", href: "/history", icon: Activity },
];

const preferences = [
  { name: "My Profile", href: "/profile", icon: UserRound },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const linkClass = (href: string) => {
    const active = pathname === href;

    return active
      ? "flex items-center gap-3 rounded-xl bg-violet-600/15 px-4 py-3 text-sm font-semibold text-violet-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";
  };

  const renderLinks = (items: typeof navigation) => (
    <nav className="space-y-2" aria-label="Sidebar navigation">
      {items.map(({ name, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={closeMobileMenu}
          aria-current={pathname === href ? "page" : undefined}
          className={linkClass(href)}
        >
          <Icon size={18} aria-hidden="true" />
          {name}
        </Link>
      ))}
    </nav>
  );

  const sidebarContent = (mobile = false) => (
    <>
      <div className="flex h-20 items-center justify-between gap-3 border-b border-border px-7">
        <Link
          href="/dashboard"
          onClick={mobile ? closeMobileMenu : undefined}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="SkillSync dashboard"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Zap size={22} aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-foreground">SkillSync</h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground">
              CAREER INTELLIGENCE
            </p>
          </div>
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <X size={21} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
          WORKSPACE
        </p>

        {renderLinks(navigation)}

        <p className="mb-4 mt-10 px-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
          PREFERENCES
        </p>

        {renderLinks(preferences)}
      </div>

      <div className="border-t border-border p-5">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Zap size={15} className="text-violet-500" aria-hidden="true" />
            Skill up faster
          </div>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Track your progress and close your skill gaps.
          </p>

          <Link
            href="/analyzer"
            onClick={mobile ? closeMobileMenu : undefined}
            className="mt-3 inline-flex items-center gap-2 rounded-sm text-xs font-semibold text-violet-500 hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Analyze a job <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        {sidebarContent()}
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
        aria-controls="mobile-sidebar"
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 lg:hidden"
      >
        <Menu size={21} aria-hidden="true" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-sidebar"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent(true)}
      </aside>
    </>
  );
}
