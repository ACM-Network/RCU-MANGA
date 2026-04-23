"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">System Fault</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">The platform hit a render anomaly.</h1>
        <p className="mt-4 text-stone-300">{error.message || "Something unexpected interrupted the experience."}</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
