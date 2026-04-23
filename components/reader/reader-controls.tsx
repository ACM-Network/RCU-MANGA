"use client";

import Link from "next/link";

interface ReaderControlsProps {
  title: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  visible: boolean;
  onBack: () => void;
  nextChapterHref?: string | null;
}

export function ReaderControls({
  title,
  currentPage,
  totalPages,
  progress,
  visible,
  onBack,
  nextChapterHref,
}: ReaderControlsProps) {
  return (
    <>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <div className="pointer-events-auto mx-3 flex items-center gap-3 rounded-full bg-black/28 px-3 py-2 text-white backdrop-blur-md sm:mx-4 sm:max-w-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-black/28 px-4 text-sm font-semibold transition hover:bg-white/10"
          >
            Back
          </button>
          <p className="min-w-0 truncate text-sm font-medium text-zinc-100">{title}</p>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="pointer-events-auto mx-3 rounded-[20px] bg-black/34 px-4 py-3 backdrop-blur-md sm:mx-4 sm:max-w-sm">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-zinc-300">
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-fuchsia-600 transition-[width] duration-200"
              style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
            />
          </div>
          {nextChapterHref && currentPage === totalPages - 1 ? (
            <Link
              href={nextChapterHref}
              className="mt-3 flex min-h-10 items-center justify-center rounded-full border border-rose-500/25 bg-rose-500/12 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-rose-100 transition hover:bg-rose-500/18"
            >
              Next Chapter
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
