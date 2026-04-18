"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type Mode = "login" | "signup";

export function AuthPanel() {
  const { isConfigured, signIn, signUp, user, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      setPassword("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel rounded-[32px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.42em] text-rose-400">Reader Identity</p>
        <h1 className="section-title mt-4 text-4xl text-white">Account Sync</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-zinc-300">
          Sign in to store bookmarks, reading history, and liked chapters in Firebase. If credentials are not configured yet, the platform still runs in local demo mode so design, browsing, and reader flows remain testable.
        </p>

        <div className="mt-8 space-y-4 rounded-[24px] border border-white/8 bg-black/30 p-5 text-sm text-zinc-300">
          <p>Bookmarks sync across series detail pages and the reader.</p>
          <p>Reading history powers the Continue Reading lane on the homepage.</p>
          <p>Liked chapters stay attached to the reader profile for engagement tracking.</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
        {!isConfigured ? (
          <div className="space-y-4 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
            <p className="font-semibold uppercase tracking-[0.22em]">Firebase Not Configured</p>
            <p>
              Add your `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` to enable email/password authentication and cloud persistence.
            </p>
          </div>
        ) : null}

        {user ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-rose-400">Active Session</p>
              <h2 className="section-title mt-3 text-3xl text-white">{user.displayName ?? "RCPU Reader"}</h2>
              <p className="mt-2 text-zinc-300">{user.email}</p>
            </div>
            <Button onClick={() => void signOut()}>Logout</Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setMode("signup")}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${
                  mode === "signup" ? "bg-white/10 text-white" : "text-zinc-400"
                }`}
              >
                Signup
              </button>
              <button
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${
                  mode === "login" ? "bg-white/10 text-white" : "text-zinc-400"
                }`}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Display name"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              ) : null}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Login"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
