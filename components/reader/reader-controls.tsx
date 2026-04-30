"use client";

import Link from "next/link";
import { memo } from "react";

interface ReaderControlsProps {
  title: string;
  currentPage: number;
  totalPages: number;
  visible: boolean;
  onBack: () => void;
  nextChapterHref?: string | null;
}

export const ReaderControls = memo(function ReaderControls({
  title,
  currentPage,
  totalPages,
  visible,
  onBack,
  nextChapterHref,
}: ReaderControlsProps) {
  const pageCount = Math.max(0, totalPages);
  const displayPage = pageCount ? Math.min(pageCount, Math.max(1, currentPage + 1)) : 0;

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "max(0.85rem, env(safe-area-inset-top))" }}
      >
        <div className="pointer-events-auto mx-3 flex items-center gap-3 rounded-full border border-white/10 bg-black/38 px-3 py-2 text-white backdrop-blur-xl sm:mx-5 sm:max-w-lg">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10"
          >
            Back
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{title}</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">Tap center to hide UI</p>
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-fit flex-col items-center gap-3 px-4">
          {nextChapterHref && pageCount > 0 && currentPage === pageCount - 1 ? (
            <Link
              href={nextChapterHref}
              className="pointer-events-auto rounded-full border border-white/10 bg-white/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white backdrop-blur-xl transition hover:bg-white/14"
            >
              Next Chapter
            </Link>
          ) : null}

          <div className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.32em] text-stone-200 backdrop-blur-xl">
            {displayPage} / {pageCount}
          </div>
        </div>
      </div>
    </>
  );
});
