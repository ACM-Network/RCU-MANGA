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
      <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/10 p-8">
        <p className="text-xs uppercase tracking-[0.42em] text-rose-300">System Fault</p>
        <h1 className="section-title mt-4 text-4xl text-white">The universe hit a render anomaly.</h1>
        <p className="mt-4 text-zinc-300">{error.message || "Something unexpected interrupted the experience."}</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
