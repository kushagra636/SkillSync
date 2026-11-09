"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileSearch,
  Loader2,
  Target,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Analysis = {
  id: string;
  jobDescription: string;
  matchScore: number;
  totalRequiredSkills: number;
  matchedSkills: string[];
  missingSkills: string[];
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await apiRequest<{
          success: boolean;
          count: number;
          history: Analysis[];
        }>("/analyzer/history");

        setHistory(response.history);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load analysis history."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  async function openAnalysis(id: string) {
    setDetailLoading(true);
    setError("");

    try {
      const response = await apiRequest<{
        success: boolean;
        analysis: Analysis;
      }>(`/analyzer/history/${id}`);

      setSelected(response.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load analysis details."
      );
    } finally {
      setDetailLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getScoreColor(score: number) {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-orange-400";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-violet-400" size={35} />
          <p className="mt-4 text-sm text-muted-foreground">Loading analysis history...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-2 text-sm text-violet-400">
              <BriefcaseBusiness size={17} />
              CAREER INTELLIGENCE
            </div>

            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Analysis History
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Review your previous job compatibility analyses and track your progress.
            </p>
          </div>

          <Link
            href="/analyzer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            <Target size={17} />
            Analyze a Job
          </Link>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Analyses</p>
            <p className="mt-3 text-3xl font-semibold">{history.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">Saved job descriptions</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Average Match Score</p>
            <p className="mt-3 text-3xl font-semibold">
              {history.length
                ? `${Math.round(history.reduce((sum, item) => sum + item.matchScore, 0) / history.length)}%`
                : "—"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Across all analyses</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Latest Analysis</p>
            <p className="mt-3 text-xl font-semibold">
              {history.length ? formatDate(history[0].createdAt).split(",")[0] : "—"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Most recent activity</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Previous Analyses</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Select an analysis to see its complete results.
              </p>
            </div>
            <FileSearch size={21} className="text-violet-400" />
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <BriefcaseBusiness size={28} />
              </div>
              <h3 className="mt-5 font-semibold">No analyses yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your saved job analyses will appear here.
              </p>
              <Link
                href="/analyzer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                Analyze Your First Job <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openAnalysis(item.id)}
                  className={`w-full rounded-xl border p-5 text-left transition hover:border-violet-500/40 hover:bg-muted ${
                    selected?.id === item.id
                      ? "border-violet-500/50 bg-violet-500/[0.05]"
                      : "border-border bg-muted/50"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <BriefcaseBusiness size={17} className="shrink-0 text-violet-400" />
                        <h3 className="font-medium">Job Analysis</h3>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {item.jobDescription}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(item.createdAt)}
                        </span>
                        <span>{item.totalRequiredSkills} required skills</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                        <p className={`mt-1 text-2xl font-bold ${getScoreColor(item.matchScore)}`}>
                          {item.matchScore}%
                        </p>
                      </div>
                      <ArrowUpRight size={19} className="text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {detailLoading && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
            <Loader2 size={19} className="animate-spin text-violet-400" />
            Loading analysis details...
          </div>
        )}

        {selected && !detailLoading && (
          <section className="space-y-6 rounded-2xl border border-violet-500/20 bg-card p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-medium tracking-wider text-violet-400">
                  SELECTED ANALYSIS
                </p>
                <h2 className="mt-2 text-xl font-semibold">Analysis Details</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  <Clock size={13} className="mr-1 inline" />
                  {formatDate(selected.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Close Details
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Match Score</p>
                <p className={`mt-2 text-3xl font-bold ${getScoreColor(selected.matchScore)}`}>
                  {selected.matchScore}%
                </p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Matched Skills</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {selected.matchedSkills.length}
                </p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Missing Skills</p>
                <p className="mt-2 text-3xl font-bold text-orange-400">
                  {selected.missingSkills.length}
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-emerald-400">
                  <CheckCircle2 size={18} /> Matched Skills
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.matchedSkills.length ? (
                    selected.matchedSkills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No matched skills.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-orange-500/20 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-orange-400">
                  <XCircle size={18} /> Missing Skills
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.missingSkills.length ? (
                    selected.missingSkills.map((skill) => (
                      <span key={skill} className="rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No missing skills.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Original Job Description</h3>
              <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-background p-5 text-sm leading-7 text-muted-foreground">
                {selected.jobDescription}
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © 2026 SkillSync. Built for developers.
        </footer>

      </div>
    </main>
  );
}
