"use client";

import { useState } from "react";
import {
  Target,
  Zap,
  BriefcaseBusiness,
  Code2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileText
} from "lucide-react";
import Link from "next/link";
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

export default function AnalyzerPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remainingCharacters = 10000 - jobDescription.length;

  async function handleAnalyze() {
    setError("");
    setAnalysis(null);

    if (jobDescription.trim().length < 50) {
      setError("Please enter a job description with at least 50 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        analysis: Analysis;
      }>("/analyzer/analyze", {
        method: "POST",
        body: JSON.stringify({ jobDescription })
      });

      setAnalysis(response.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to analyze job description."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <section>
          <div className="flex items-center gap-2 text-sm text-violet-400">
            <Target size={17} />
            CAREER INTELLIGENCE
          </div>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Job Description Analyzer
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Discover how well your technical skills match a job opportunity.
                Identify your strengths and the skills you need to improve.
              </p>
            </div>

            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
            >
              <FileText size={17} />
              Analysis History
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
              <BriefcaseBusiness size={22} />
            </div>
            <div>
              <h2 className="font-semibold">Paste Job Description</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter the complete job description below.
              </p>
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here...

Example:
We are looking for a Full Stack Developer with experience in React, Next.js, Node.js, Express, PostgreSQL, Docker and Git. The candidate should have strong knowledge of REST APIs and cloud technologies..."
            maxLength={10000}
            rows={12}
            className="mt-6 w-full resize-y rounded-xl border border-border bg-background p-5 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-violet-500"
          />

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} / 10,000 characters · Minimum 50 characters
            </p>

            <button
              onClick={() => setJobDescription("")}
              disabled={!jobDescription || loading}
              className="text-left text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              Clear text
            </button>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || jobDescription.trim().length < 50}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-violet-600 px-6 py-4 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing your skills...
              </>
            ) : (
              <>
                <Zap size={18} />
                Analyze Job Description
              </>
            )}
          </button>
        </section>

        {analysis && (
          <section className="space-y-6">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <h2 className="text-xl font-semibold">Analysis Complete</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">

              <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Compatibility
                </p>

                <div
                  className="relative mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#8b5cf6 0% ${analysis.matchScore}%, #292535 ${analysis.matchScore}% 100%)`
                  }}
                >
                  <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-card">
                    <span className="text-5xl font-bold">
                      {analysis.matchScore}%
                    </span>
                    <span className="mt-2 text-xs text-muted-foreground">
                      Match Score
                    </span>
                  </div>
                </div>

                <p className="mt-7 text-center text-sm text-muted-foreground">
                  {analysis.matchScore >= 75
                    ? "Excellent skill match!"
                    : analysis.matchScore >= 50
                    ? "Good progress. Keep improving!"
                    : analysis.matchScore > 0
                    ? "There are some important skills to develop."
                    : "No matching skills found yet."}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">

                <div className="rounded-2xl border border-emerald-500/20 bg-card p-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={19} />
                    <h3 className="font-semibold">Matched Skills</h3>
                  </div>

                  <p className="mt-2 text-3xl font-bold">
                    {analysis.matchedSkills.length}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Skills already in your profile
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {analysis.matchedSkills.length > 0 ? (
                      analysis.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No matching skills found.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-500/20 bg-card p-6">
                  <div className="flex items-center gap-2 text-orange-400">
                    <AlertCircle size={19} />
                    <h3 className="font-semibold">Missing Skills</h3>
                  </div>

                  <p className="mt-2 text-3xl font-bold">
                    {analysis.missingSkills.length}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Skills to consider learning
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {analysis.missingSkills.length > 0 ? (
                      analysis.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No missing skills!
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Analysis Summary</h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Required Skills</p>
                  <p className="mt-2 text-2xl font-bold">
                    {analysis.totalRequiredSkills}
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Matched</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    {analysis.matchedSkills.length}
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Missing</p>
                  <p className="mt-2 text-2xl font-bold text-orange-400">
                    {analysis.missingSkills.length}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Analysis saved on {new Date(analysis.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setJobDescription("");
                  setError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
              >
                Analyze Another Job
              </button>

              <Link
                href="/history"
                className="rounded-xl border border-border px-5 py-3 text-sm text-muted-foreground hover:bg-muted"
              >
                View Analysis History
              </Link>
            </div>

          </section>
        )}

        {!analysis && !loading && (
          <section className="rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <Code2 size={26} />
            </div>
            <h3 className="mt-4 font-semibold">Ready to analyze your next opportunity?</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Paste a job description above. SkillSync will compare its technical
              requirements with your saved skills and highlight your skill gaps.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
