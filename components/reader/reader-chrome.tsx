"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Chapter, Manga } from "@/lib/types";
import { formatChapterNumber } from "@/lib/utils";

interface ReaderChromeProps {
  manga: Manga;
  chapter: Chapter;
  progress: number;
  next: Chapter | null;
  onBack: () => void;
}

const reactions = [
  { label: "Fire", value: "🔥" },
  { label: "Heart", value: "❤️" },
  { label: "Cry", value: "😭" },
];

export function ReaderChrome({ manga, chapter, progress, next, onBack }: ReaderChromeProps) {
  return (
    <>
      <div className="sticky top-20 z-30 rounded-[28px] border border-white/8 bg-black/60 px-4 py-4 backdrop-blur-xl sm:px-5">
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

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Link
              href={`/manga/${manga.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:bg-white/5"
            >
              Library
            </Link>
            {next ? (
              <Link
                href={`/manga/${manga.slug}/chapter/${next.id}`}
                className="inline-flex items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-500/15"
              >
                Next Chapter
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-fuchsia-600 transition-all duration-300"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="sticky bottom-4 z-20 mt-[-12px]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/8 bg-black/65 px-4 py-3 backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            Reading {Math.round(progress * 100)}%
          </div>
          <div className="flex items-center gap-2">
            {reactions.map((reaction) => (
              <button
                key={reaction.label}
                type="button"
                aria-label={reaction.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg transition hover:-translate-y-0.5 hover:bg-white/10"
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
