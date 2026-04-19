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
  cinematic: boolean;
  musicOn: boolean;
  isLiked: boolean;
  next: Chapter | null;
  onBack: () => void;
  onToggleFullscreen: () => void;
  onToggleMusic: () => void;
  onToggleLike: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onZoomReset: () => void;
}

const reactions = [
  { label: "Fire", value: "Fire" },
  { label: "Love", value: "Love" },
  { label: "Cry", value: "Cry" },
];

export function ReaderChrome({
  manga,
  chapter,
  progress,
  currentPanel,
  totalPanels,
  zoomLevel,
  cinematic,
  musicOn,
  isLiked,
  next,
  onBack,
  onToggleFullscreen,
  onToggleMusic,
  onToggleLike,
  onZoomOut,
  onZoomIn,
  onZoomReset,
}: ReaderChromeProps) {
  const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <>
      <div className="sticky top-[72px] z-30 rounded-[24px] border border-white/8 bg-black/72 px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.42em] text-rose-400">{manga.universe}</p>
            <div>
              <h1 className="section-title text-2xl text-white sm:text-3xl">{manga.title}</h1>
              <p className="mt-2 text-sm text-zinc-300">
                {formatChapterNumber(chapter.number)} - {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button variant="ghost" className="min-h-11 px-4 py-2.5" onClick={onBack}>
              Back
            </Button>
            <Link
              href={`/manga/${manga.slug}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:bg-white/5"
            >
              Library
            </Link>
            {next ? (
              <Link
                href={`/manga/${manga.slug}/chapter/${next.id}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-500/15"
              >
                Next Chapter
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
          <span>
            Panel {Math.min(totalPanels, currentPanel)} / {totalPanels}
          </span>
          <span>{progressPercent}% complete</span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-fuchsia-600 transition-all duration-300"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onZoomOut}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            Zoom -
          </button>
          <button
            type="button"
            onClick={onZoomReset}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            Zoom +
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            {musicOn ? "Audio On" : "Audio Off"}
          </button>
          <button
            type="button"
            onClick={onToggleLike}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/15"
          >
            {cinematic ? "Exit Focus" : "Cinematic"}
          </button>
        </div>
      </div>

      <div className="sticky bottom-3 z-20 mt-[-8px] sm:bottom-4">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/8 bg-black/68 px-3 py-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-4">
          <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-400 sm:text-xs">
            Reading {progressPercent}%
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.label}
                type="button"
                aria-label={reaction.label}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-100 transition hover:bg-white/10 sm:text-xs"
              >
                {reaction.value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
