"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,


  Target,
  TrendingUp,
  UserRound,
  Plus,
  Bell,
  ChevronDown,
  LogOut,

  CircleDot
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { apiRequest } from "@/lib/api";

type CurrentUser = { name: string; email: string };

type DashboardData = {
  overview: {
    totalSkills: number;
    totalAnalyses: number;
    averageProficiency: number;
  };
  proficiencyBreakdown: {
    proficiency: string;
    count: number;
  }[];
  latestAnalysis: {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    createdAt: string;
  } | null;
  skillGaps: {
    skillName: string;
    count: number;
  }[];
  recentActivity: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
  profile: {
    education: string | null;
    experience: number | null;
  } | null;
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition hover:border-violet-500/30">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
          <Icon size={19} />
        </div>
      </div>
      <h3 className="mt-5 text-3xl font-semibold text-foreground">{value}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await apiRequest<{
          success: boolean;
          dashboard: DashboardData;
        }>("/dashboard");

        setDashboard(response.dashboard);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load dashboard";

        if (
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("authentication")
        ) {
          router.replace("/login");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();

    async function fetchCurrentUser() {
      try {
        const response = await apiRequest<{ success: boolean; user: CurrentUser }>("/auth/me");
        setCurrentUser(response.user);
      } catch {
        router.replace("/login");
      }
    }

    fetchCurrentUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">Unable to load dashboard</h2>
          <p className="mt-3 text-sm text-red-400">
            {error || "Dashboard data is unavailable."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { overview, proficiencyBreakdown, latestAnalysis, skillGaps, recentActivity, profile } =
    dashboard;

  const proficiencyData = proficiencyBreakdown.map((item) => ({
    name: item.proficiency.charAt(0) + item.proficiency.slice(1).toLowerCase(),
    count: item.count
  }));

  const average = overview.averageProficiency.toFixed(2);

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main>
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/90 pl-16 pr-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div>
            <p className="text-xs text-muted-foreground">Workspace / Overview</p>
            <h2 className="mt-1 text-lg font-semibold">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-muted">
              <Bell size={18} />
            </button>
            <div className="relative border-l border-border pl-4">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium">{currentUser?.name || "Loading..."}</p>
                  <p className="max-w-40 truncate text-xs text-muted-foreground">{currentUser?.email || "SkillSync Member"}</p>
                </div>
                <ChevronDown size={15} className="hidden text-muted-foreground sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-border bg-popover p-2 shadow-xl">
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium">{currentUser?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                  <a href="/profile" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                    My Profile
                  </a>
                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={async () => {
                      setLoggingOut(true);
                      try {
                        await apiRequest("/auth/logout", { method: "POST" });
                        router.replace("/login");
                        router.refresh();
                      } catch {
                        setError("Unable to log out. Please try again.");
                        setLoggingOut(false);
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-8 p-5 sm:p-8 lg:p-10">
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-violet-400">YOUR DEVELOPER WORKSPACE</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {currentUser?.name?.split(" ")[0] || "there"} ✦
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Here's how your developer journey is progressing.
              </p>
            </div>

            <a href="/analyzer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500">
              <Plus size={17} /> Analyze a job
            </a>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Skills" value={String(overview.totalSkills)} subtitle="Skills in your profile" icon={Code2} />
            <StatCard title="Jobs Analyzed" value={String(overview.totalAnalyses)} subtitle="Job descriptions reviewed" icon={BriefcaseBusiness} />
            <StatCard title="Average Proficiency" value={`${average} / 3`} subtitle="Across your listed skills" icon={TrendingUp} />
            <StatCard title="Latest Match" value={latestAnalysis ? `${latestAnalysis.matchScore}%` : "—"} subtitle="Latest job compatibility" icon={Target} />
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Skill proficiency distribution</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your actual skill levels from your profile
                  </p>
                </div>
                <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  Live data
                </span>
              </div>

              <div className="mt-7 h-64">
                {proficiencyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={proficiencyData} margin={{ top: 10, right: 15, bottom: 5, left: 5 }}>
                      <CartesianGrid stroke="#ffffff0d" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} stroke="#71717a" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "#181824", border: "1px solid #333", borderRadius: 12 }} />
                      <Bar dataKey="count" name="Skills" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={38} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Add skills to see your proficiency distribution.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Latest job match</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {latestAnalysis ? `Analyzed ${formatDate(latestAnalysis.createdAt)}` : "No job analysis yet"}
              </p>

              <div
                className="relative mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#8b5cf6 0% ${latestAnalysis?.matchScore ?? 0}%, #292535 ${latestAnalysis?.matchScore ?? 0}% 100%)`
                }}
              >
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-card">
                  <span className="text-4xl font-bold">
                    {latestAnalysis ? `${latestAnalysis.matchScore}%` : "—"}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">Match score</span>
                </div>
              </div>

              <div className="mt-7 flex justify-between text-xs">
                <span className="text-emerald-400">
                  {latestAnalysis?.matchedSkills.length ?? 0} matched skills
                </span>
                <span className="text-orange-400">
                  {latestAnalysis?.missingSkills.length ?? 0} missing skills
                </span>
              </div>

              <a href="/analyzer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 py-3 text-sm font-medium text-violet-300 hover:bg-violet-500/10">
                Analyze another job <ArrowUpRight size={15} />
              </a>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Profile overview</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your education and experience
                  </p>
                </div>
                <UserRound size={19} className="text-violet-400" />
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs text-muted-foreground">Education</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.education || "Not added yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.experience != null
                      ? `${profile.experience} years`
                      : "Not added yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average proficiency</p>
                  <p className="mt-1 text-sm font-medium">{average} / 3</p>
                </div>
              </div>

              <a href="/profile" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm text-muted-foreground hover:bg-muted">
                Update profile <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Skills to improve</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Frequently missing from your job matches
                  </p>
                </div>
                <Target size={19} className="text-violet-400" />
              </div>

              <div className="mt-5 space-y-3">
                {skillGaps.length > 0 ? (
                  skillGaps.map((skill) => (
                    <div key={skill.skillName} className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                        <span className="text-sm font-medium">{skill.skillName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Missing {skill.count} {skill.count === 1 ? "time" : "times"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No skill gaps yet. Analyze a job to discover what to learn next.
                  </p>
                )}
              </div>

              <a href="/analyzer" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm text-muted-foreground hover:bg-muted">
                Analyze a job <ArrowUpRight size={15} />
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Recent activity</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your latest updates and actions
                </p>
              </div>
              <a href="/history" className="text-xs text-violet-400 hover:text-violet-300">
                View history
              </a>
            </div>

            <div className="mt-5 divide-y divide-border">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4 py-4">
                    <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                      {activity.type === "JOB_ANALYZED" ? (
                        <BriefcaseBusiness size={18} />
                      ) : (
                        <Code2 size={18} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Your recent activity will appear here.
                </p>
              )}
            </div>
          </section>

          <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 SkillSync. Built for developers.</p>
            <p className="flex items-center gap-2">
              <CircleDot size={12} className="text-emerald-400" />
              Connected to live database
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
