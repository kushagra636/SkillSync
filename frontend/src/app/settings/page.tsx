"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Palette,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await apiRequest<{
          success: boolean;
          user: CurrentUser;
        }>("/auth/me");

        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadSettings();

    const savedTheme = localStorage.getItem("skillsync-theme");
    setTheme(savedTheme === "light" ? "light" : "dark");
  }, []);

  function handleThemeChange(nextTheme: "dark" | "light") {
    setTheme(nextTheme);
    localStorage.setItem("skillsync-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordMessage(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-violet-400">
            PREFERENCES
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your account, security, and application preferences.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <UserRound size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Account information</h2>
                <p className="text-sm text-muted-foreground">
                  Your registered SkillSync account details.
                </p>
              </div>
            </div>

            {loadingUser ? (
              <p className="text-sm text-muted-foreground">Loading account details...</p>
            ) : user ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="mt-1 font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email address</p>
                  <p className="mt-1 break-all font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="mt-1 font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-400">
                Unable to load account information.
              </p>
            )}
            <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              Your account name and email are currently read-only.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">
                  Keep your account protected with a strong password.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current password</label>
                <div className="relative">
                  <input
                    className={inputClass}
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter current password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <input
                    className={inputClass}
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    maxLength={72}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Confirm new password
                  </label>
                  <input
                    className={inputClass}
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter new password"
                    minLength={8}
                    maxLength={72}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
              >
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                {showPasswords ? "Hide passwords" : "Show passwords"}
              </button>

              {passwordError && (
                <p className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} />
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole size={16} />
                {changingPassword ? "Updating password..." : "Change password"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Choose how SkillSync looks on this device.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  theme === "dark"
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-border bg-muted hover:bg-muted"
                }`}
              >
                <Moon size={20} className="text-violet-400" />
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                </div>
                {theme === "dark" && (
                  <CheckCircle2 size={17} className="ml-auto text-violet-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  theme === "light"
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-border bg-muted hover:bg-muted"
                }`}
              >
                <Sun size={20} className="text-amber-400" />
                <div>
                  <p className="text-sm font-medium">Light mode</p>
                  <p className="text-xs text-muted-foreground">A brighter interface</p>
                </div>
                {theme === "light" && (
                  <CheckCircle2 size={17} className="ml-auto text-violet-400" />
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Your appearance preference is saved in this browser.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}