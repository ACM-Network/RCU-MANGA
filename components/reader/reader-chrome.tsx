"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Chapter, Manga } from "@/lib/types";
import { formatChapterNumber } from "@/lib/utils";

interface ReaderChromeProps {
  manga: Manga;
  chapter: Chapter;
  progress: number;
  currentPanel: number;
  totalPanels: number;
  zoomLevel: number;
  next: Chapter | null;
  showNextCta: boolean;
  onBack: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onZoomReset: () => void;
}

export function ReaderChrome({
  manga,
  chapter,
  progress,
  currentPanel,
  totalPanels,
  zoomLevel,
  next,
  showNextCta,
  onBack,
  onZoomOut,
  onZoomIn,
  onZoomReset,
}: ReaderChromeProps) {
  const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <>
      <div className="sticky top-[72px] z-30 rounded-[24px] border border-white/8 bg-black/75 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="min-h-10 shrink-0 px-4 py-2" onClick={onBack}>
                Back
              </Button>
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.28em] text-rose-400">
                  {manga.title}
                </p>
                <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                  {formatChapterNumber(chapter.number)} - {chapter.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={onZoomOut}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
            >
              Zoom -
            </button>
            <button
              type="button"
              onClick={onZoomReset}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={onZoomIn}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
            >
              Zoom +
            </button>
          </div>
        </div>
      </div>

      <div className="sticky bottom-3 z-30 mt-[-8px] sm:bottom-4">
        <div className="mx-auto w-full max-w-4xl rounded-[22px] border border-white/8 bg-black/78 p-3 shadow-[0_14px_34px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-zinc-400 sm:text-xs">
            <span>
              Panel {Math.min(totalPanels, currentPanel)} / {totalPanels}
            </span>
            <span>{progressPercent}%</span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-fuchsia-600 transition-[width] duration-200"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>

          {next && showNextCta ? (
            <Link
              href={`/manga/${manga.slug}/chapter/${next.id}`}
              className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/12 px-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-500/18"
            >
              Next Chapter
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
