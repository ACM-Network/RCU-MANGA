"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getInitials } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  email: string;
  photoURL?: string | null;
  isAuthenticated: boolean;
  loading?: boolean;
  syncMessage?: string | null;
  onLogout: () => void | Promise<void>;
}

function photoBackground(photoURL: string | null | undefined) {
  if (!photoURL) {
    return undefined;
  }

  return {
    backgroundImage: `url("${photoURL.replace(/"/g, '\\"')}")`,
  };
}

export function ProfileCard({
  name,
  email,
  photoURL,
  isAuthenticated,
  loading = false,
  syncMessage,
  onLogout,
}: ProfileCardProps) {
  const displayName = name.trim() || "Guest Reader";
  const displayEmail = email.trim() || "Sign in to sync your reader";

  if (loading) {
    return (
      <section className="panel overflow-hidden rounded-[32px] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 shrink-0 rounded-[28px]" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="mt-4 h-8 w-2/3" />
            <Skeleton className="mt-3 h-4 w-4/5" />
          </div>
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-full" />
      </section>
    );
  }

  return (
    <section className="panel card-hover overflow-hidden rounded-[32px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[28px] border border-white/10 text-xl font-semibold text-[#08090d] shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
            photoURL
              ? "bg-cover bg-center"
              : "bg-[linear-gradient(135deg,#ff8a54_0%,#ffca67_46%,#70d6d1_100%)]",
          )}
          style={photoBackground(photoURL)}
          aria-label={`${displayName} profile photo`}
        >
          {!photoURL ? getInitials(displayName) : null}
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/15" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-stone-200">
              {isAuthenticated ? "Signed In" : "Guest Mode"}
            </span>
            {syncMessage ? (
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-amber-100">
                Local Sync
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 truncate text-3xl font-semibold text-white">{displayName}</h2>
          <p className="mt-2 truncate text-sm text-stone-300">{displayEmail}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {isAuthenticated ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => void onLogout()}
          >
            Logout
          </Button>
        ) : (
          <ButtonLink href="/auth" className="w-full">
            Sign In
          </ButtonLink>
        )}
        <ButtonLink href="/library" variant="ghost" className="w-full">
          Browse Library
        </ButtonLink>
      </div>
    </section>
  );
}
