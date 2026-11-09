"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus, Code2, Trash2, Pencil, X, Loader2,
  Search, Sparkles, AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface Skill {
  id: string;
  skillName: string;
  proficiency: Proficiency;
  createdAt: string;
}

interface SkillsResponse {
  success: boolean;
  skills: Skill[];
}

const proficiencyStyle: Record<Proficiency, string> = {
  BEGINNER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  INTERMEDIATE: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  ADVANCED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] =
    useState<Proficiency>("BEGINNER");
  const [saving, setSaving] = useState(false);

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiRequest<SkillsResponse>("/users/skills");
      setSkills(result.skills || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load skills. Please log in."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const resetForm = () => {
    setSkillName("");
    setProficiency("BEGINNER");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!skillName.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await apiRequest(`/users/skills/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            proficiency
          })
        });
      } else {
        await apiRequest("/users/skills", {
          method: "POST",
          body: JSON.stringify({
            skillName: skillName.trim(),
            proficiency
          })
        });
      }

      resetForm();
      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setSkillName(skill.skillName);
    setProficiency(skill.proficiency);
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      setError("");

      await apiRequest(`/users/skills/${id}`, {
        method: "DELETE"
      });

      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete skill."
      );
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.skillName.toLowerCase().includes(search.toLowerCase())
  );

  const advancedCount = skills.filter(
    skill => skill.proficiency === "ADVANCED"
  ).length;

  const intermediateCount = skills.filter(
    skill => skill.proficiency === "INTERMEDIATE"
  ).length;

  const beginnerCount = skills.filter(
    skill => skill.proficiency === "BEGINNER"
  ).length;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">

        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-400">
              SKILL MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold">My Skills</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your technical skills and track your proficiency.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
          >
            <Plus size={18} /> Add Skill
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Skills</p>
            <h2 className="mt-3 text-3xl font-bold">{skills.length}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Advanced</p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-400">{advancedCount}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Intermediate</p>
            <h2 className="mt-3 text-3xl font-bold text-violet-400">{intermediateCount}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Beginner</p>
            <h2 className="mt-3 text-3xl font-bold text-blue-400">{beginnerCount}</h2>
          </div>
        </section>

        {showForm && (
          <section className="rounded-2xl border border-violet-500/20 bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Update Skill" : "Add New Skill"}
              </h2>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Skill Name
                </label>
                <input
                  value={skillName}
                  onChange={event => setSkillName(event.target.value)}
                  placeholder="e.g. React, Node.js, Python"
                  disabled={Boolean(editingId)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-violet-500 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted-foreground">
                  Proficiency Level
                </label>
                <select
                  value={proficiency}
                  onChange={event =>
                    setProficiency(event.target.value as Proficiency)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-violet-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50 sm:col-span-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Update Skill" : "Save Skill"}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">Your technical skills</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Skills stored in your SkillSync profile
              </p>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search skills..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm outline-none focus:border-violet-500 sm:w-64"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              Loading your skills...
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="py-16 text-center">
              <Code2 size={32} className="mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold">
                {search ? "No matching skills" : "No skills added yet"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "Add your first technical skill to get started."}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map(skill => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-violet-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                        <Code2 size={19} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{skill.skillName}</h3>
                        <span className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-[10px] font-medium ${proficiencyStyle[skill.proficiency]}`}>
                          {skill.proficiency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2 border-t border-border pt-3">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles size={14} className="text-violet-400" />
          Your skills help SkillSync calculate job compatibility.
        </div>
      </div>
    </main>
  );
}
