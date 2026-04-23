"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type Mode = "login" | "signup";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { isConfigured, signIn, signInWithGoogle, signOut, signUp, user } = useAuth();

  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.replace(returnTo || "/");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  }

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

      router.replace(returnTo || "/");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="panel overflow-hidden rounded-[34px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Account System</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Unlock the full reader.</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-stone-300">
          Sign in to unlock complete chapters, sync bookmarks, save progress on every page turn, and keep a persistent Continue Reading rail across sessions.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Retention Layer</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Guests can preview a chapter. Accounts unlock the full experience and persistent reading history.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Cloud Sync</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Firebase saves bookmarks, likes, and page-level progress so re-entry feels instant.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Protected Access</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Authenticated sessions can be wired to protected Firebase Storage and App Check for stronger asset protection.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[34px] border border-white/8 bg-[#111217]/85 p-6 sm:p-8">
        {!isConfigured ? (
          <div className="mb-6 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
            Add your Firebase public keys to `.env.local` to enable Google and email authentication.
          </div>
        ) : null}

        {user ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Active Session</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                {user.displayName || "Cinematic Reader"}
              </h2>
              <p className="mt-2 text-stone-300">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={returnTo || "/"}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                {returnTo ? "Return to Reader" : "Back to Home"}
              </Link>
              <Button variant="secondary" onClick={() => void signOut()}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-3">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${
                  mode === "signup" ? "bg-white/10 text-white" : "text-stone-400"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${
                  mode === "login" ? "bg-white/10 text-white" : "text-stone-400"
                }`}
              >
                Login
              </button>
            </div>

            <div className="space-y-3">
              <Button className="w-full" disabled={loading || !isConfigured} onClick={() => void handleGoogle()}>
                {loading ? "Connecting..." : "Continue with Google"}
              </Button>
              <p className="text-center text-xs uppercase tracking-[0.3em] text-stone-500">or use email</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Display name"
                  className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
                />
              ) : null}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
              />
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading || !isConfigured}>
                {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Login"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
