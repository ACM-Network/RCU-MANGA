"use client";

import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface GuestPaywallProps {
  visible: boolean;
  onClose: () => void;
}

export const GuestPaywall = memo(function GuestPaywall({ visible, onClose }: GuestPaywallProps) {
  const { isConfigured, signInWithGoogle, signUp } = useAuth();
  const [mode, setMode] = useState<"actions" | "email">("actions");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) {
    return null;
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      onClose();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(name, email, password);
      onClose();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Email signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#111116]/95 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.55)] sm:p-7">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-200/80">Preview Limit</p>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-white">Continue Reading</h2>
            <p className="text-sm leading-7 text-stone-300">
              Create an account to unlock the full chapter, sync progress, and keep your place across every device.
            </p>
          </div>
        </div>

        {!isConfigured ? (
          <div className="mt-6 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
            Firebase authentication is not configured yet. Add your Firebase public keys to enable Google and email sign-in.
          </div>
        ) : null}

        {mode === "actions" ? (
          <div className="mt-8 space-y-3">
            <Button className="w-full" disabled={loading || !isConfigured} onClick={() => void handleGoogle()}>
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={loading || !isConfigured}
              onClick={() => setMode("email")}
            >
              Sign up with Email
            </Button>
          </div>
        ) : (
          <form className="mt-8 space-y-3" onSubmit={handleEmailSignup}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Display name"
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
            <Button className="w-full" disabled={loading || !isConfigured} type="submit">
              {loading ? "Unlocking..." : "Create Account & Continue"}
            </Button>
            <button
              type="button"
              className="w-full rounded-full px-4 py-2 text-sm text-stone-400 transition hover:text-white"
              onClick={() => setMode("actions")}
            >
              Back
            </button>
          </form>
        )}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  );
});
