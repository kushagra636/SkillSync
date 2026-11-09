"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  CodeXml,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Pencil
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Profile = {
  bio: string | null;
  education: string | null;
  experience: number | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    bio: "",
    education: "",
    experience: 0,
    githubUrl: "",
    linkedinUrl: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiRequest<{
          success: boolean;
          profile: Profile;
        }>("/users/profile");

        setProfile({
          bio: response.profile.bio ?? "",
          education: response.profile.education ?? "",
          experience: response.profile.experience ?? 0,
          githubUrl: response.profile.githubUrl ?? "",
          linkedinUrl: response.profile.linkedinUrl ?? ""
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load profile";

        if (message.toLowerCase().includes("not found")) {
          setEditing(true);
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function updateField(field: keyof Profile, value: string | number) {
    setProfile((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (profile.githubUrl && !/^https?:\/\/.+\..+/.test(profile.githubUrl)) {
      setError("Please enter a valid GitHub URL.");
      return;
    }

    if (profile.linkedinUrl && !/^https?:\/\/.+\..+/.test(profile.linkedinUrl)) {
      setError("Please enter a valid LinkedIn URL.");
      return;
    }

    setSaving(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        profile: Profile;
      }>("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          bio: profile.bio || "",
          education: profile.education || "",
          experience: Number(profile.experience ?? 0),
          githubUrl: profile.githubUrl || null,
          linkedinUrl: profile.linkedinUrl || null
        })
      });

      setProfile(response.profile);
      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 size={32} className="animate-spin text-violet-400" />
      </div>
    );
  }

  const completionFields = [
    profile.bio,
    profile.education,
    profile.experience,
    profile.githubUrl,
    profile.linkedinUrl
  ];

  const completion = Math.round(
    (completionFields.filter((field) =>
      field !== null && field !== undefined && field !== ""
    ).length / completionFields.length) * 100
  );

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <p className="flex items-center gap-2 text-sm text-violet-400">
              <UserRound size={17} />
              PERSONAL WORKSPACE
            </p>

            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Manage your professional information and developer identity.
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setSuccess("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold">
              <UserRound size={34} />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">Professional Profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Build your professional identity on SkillSync.
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground">Profile completion</p>
              <p className="mt-1 text-2xl font-bold text-violet-400">
                {completion}%
              </p>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </section>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold">Professional Information</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tell us about your background and experience.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserRound size={16} className="text-violet-400" />
                Professional Bio
              </label>
              <textarea
                value={profile.bio ?? ""}
                onChange={(e) => updateField("bio", e.target.value)}
                disabled={!editing}
                maxLength={500}
                rows={4}
                placeholder="Write a short introduction about yourself..."
                className="w-full rounded-xl border border-border bg-background p-4 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-violet-500 disabled:opacity-70"
              />
              <p className="mt-2 text-right text-xs text-muted-foreground">
                {(profile.bio ?? "").length}/500
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GraduationCap size={17} className="text-violet-400" />
                  Education
                </label>
                <input
                  value={profile.education ?? ""}
                  onChange={(e) => updateField("education", e.target.value)}
                  disabled={!editing}
                  maxLength={150}
                  placeholder="e.g. B.Tech - NIT Andhra Pradesh"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-violet-500 disabled:opacity-70"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BriefcaseBusiness size={17} className="text-violet-400" />
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={profile.experience ?? 0}
                  onChange={(e) => updateField("experience", Number(e.target.value))}
                  disabled={!editing}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-violet-500 disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold">Social Profiles</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Connect your developer profiles.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CodeXml size={18} className="text-violet-400" />
                GitHub Profile
              </label>
              <input
                type="url"
                value={profile.githubUrl ?? ""}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                disabled={!editing}
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-violet-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ExternalLink size={18} className="text-violet-400" />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profile.linkedinUrl ?? ""}
                onChange={(e) => updateField("linkedinUrl", e.target.value)}
                disabled={!editing}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-violet-500 disabled:opacity-70"
              />
            </div>
          </div>
        </section>

        {editing && (
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setError("");
              }}
              disabled={saving}
              className="rounded-xl border border-border px-5 py-3 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          � 2026 SkillSync. Built for developers.
        </footer>
      </div>
    </main>
  );
}
