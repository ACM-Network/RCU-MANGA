"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useUserLibrary } from "@/hooks/use-user-library";
import { Skeleton } from "@/components/ui/skeleton";
import { mangaLibrary } from "@/lib/content";
import { formatChapterNumber } from "@/lib/utils";

export function ContinueReading() {
  const { profile, loading } = useUserLibrary();

  const entries = useMemo(
    () =>
      Object.values(profile.readingHistory)
        .map((entry) => {
          const manga = mangaLibrary.find((item) => item.slug === entry.mangaSlug);
          const chapter = manga?.chapters.find((candidate) => candidate.id === entry.chapterId);
          return manga && chapter
            ? {
                manga,
                chapter,
                progress: entry.progress,
                panelIndex: entry.panelIndex,
                updatedAt: entry.updatedAt,
              }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => (b?.updatedAt ?? "").localeCompare(a?.updatedAt ?? "")),
    [profile.readingHistory],
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="panel rounded-[28px] p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-2/3" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <Skeleton className="mt-6 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.length ? (
        entries.map((entry) => (
          <Link
            key={entry!.chapter.id}
            href={`/manga/${entry!.manga.slug}/chapter/${entry!.chapter.id}`}
            className="panel glow-border card-hover overflow-hidden rounded-[28px] p-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-zinc-400">
                <span>{entry!.manga.universe}</span>
                <span>{Math.round(entry!.progress * 100)}%</span>
              </div>
              <div>
                <h3 className="section-title text-2xl text-white">{entry!.manga.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">
                  {formatChapterNumber(entry!.chapter.number)} - {entry!.chapter.title}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Resume at panel {entry!.panelIndex + 1}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-600"
                  style={{ width: `${Math.max(8, entry!.progress * 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="panel rounded-[28px] p-6 text-zinc-300 md:col-span-2 xl:col-span-3">
          Start a chapter and your last read position will show up here automatically.
        </div>
      )}
    </div>
  );
}
