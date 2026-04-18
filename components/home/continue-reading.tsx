"use client";

import Link from "next/link";

import { useUserLibrary } from "@/hooks/use-user-library";
import { mangaLibrary } from "@/lib/content";
import { formatChapterNumber } from "@/lib/utils";

export function ContinueReading() {
  const { profile } = useUserLibrary();

  const entries = Object.values(profile.readingHistory)
    .map((entry) => {
      const manga = mangaLibrary.find((item) => item.slug === entry.mangaSlug);
      const chapter = manga?.chapters.find((candidate) => candidate.id === entry.chapterId);
      return manga && chapter ? { manga, chapter, progress: entry.progress } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.chapter.createdAt ?? "").localeCompare(a?.chapter.createdAt ?? ""));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.length ? (
        entries.map((entry) => (
          <Link
            key={entry!.chapter.id}
            href={`/manga/${entry!.manga.slug}/chapter/${entry!.chapter.id}`}
            className="panel glow-border overflow-hidden rounded-[28px] p-5 transition hover:-translate-y-1"
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
          Start a chapter and your progress will appear here with cross-page sync through Firebase or local demo persistence.
        </div>
      )}
    </div>
  );
}
