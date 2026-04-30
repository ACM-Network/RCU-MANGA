"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserLibrary } from "@/hooks/use-user-library";
import { mangaLibrary } from "@/lib/content";
import { sortReadingHistory } from "@/lib/utils";

export function ContinueReading() {
  const { profile, loading } = useUserLibrary();

  const entries = useMemo(
    () =>
      sortReadingHistory(Object.values(profile.readingHistory))
        .map((entry) => {
          const manga = mangaLibrary.find((item) => item.slug === entry.mangaSlug);
          const chapter = manga?.chapters.find((candidate) => candidate.id === entry.chapterId);

          if (!manga || !chapter) {
            return null;
          }

          return {
            manga,
            chapter,
            progress: entry.progress,
            pageIndex: entry.pageIndex,
            updatedAt: entry.updatedAt,
          };
        })
        .filter(Boolean),
    [profile.readingHistory],
  );

  if (loading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[32px] p-6">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="mt-5 h-14 w-2/3" />
          <Skeleton className="mt-3 h-5 w-1/2" />
          <Skeleton className="mt-8 h-2 w-full rounded-full" />
          <Skeleton className="mt-6 h-12 w-40 rounded-full" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="panel rounded-[28px] p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-7 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!entries.length) {
    const featured = mangaLibrary[0];
    const firstChapter = featured?.chapters[0] ?? null;

    return (
      <div className="panel rounded-[32px] p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-400">Your Queue Is Empty</p>
        <h3 className="mt-4 text-3xl font-semibold text-white">Start one chapter and we’ll pin it here.</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
          Progress is stored locally in this browser for both guest and signed-in reading.
        </p>
        <div className="mt-6">
          <ButtonLink href={featured && firstChapter ? `/read/${featured.slug}/${firstChapter.id}` : "/library"}>
            Read Featured Premiere
          </ButtonLink>
        </div>
      </div>
    );
  }

  const current = entries[0]!;
  const queue = entries.slice(1, 3);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="panel glow-border overflow-hidden rounded-[32px] p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-stone-200">
            Continue Reading
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-stone-400">
            {Math.round(current.progress * 100)}% complete
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">{current.manga.universe}</p>
          <h3 className="text-4xl font-semibold text-white sm:text-5xl">{current.manga.title}</h3>
          <p className="text-base text-stone-200">{current.chapter.title}</p>
          <p className="max-w-2xl text-sm leading-7 text-stone-300">
            Resume at page {current.pageIndex + 1} and keep the chapter flowing exactly where you left it.
          </p>
        </div>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ff8454_0%,#ffd369_48%,#74d3d0_100%)]"
            style={{ width: `${Math.max(8, current.progress * 100)}%` }}
          />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={`/read/${current.manga.slug}/${current.chapter.id}`}>Resume Chapter</ButtonLink>
          <ButtonLink href={`/manga/${current.manga.slug}`} variant="secondary">
            View Series
          </ButtonLink>
        </div>
      </article>

      <div className="grid gap-4">
        {queue.length ? (
          queue.map((entry) => (
            <Link
              key={entry!.chapter.id}
              href={`/read/${entry!.manga.slug}/${entry!.chapter.id}`}
              className="panel card-hover rounded-[28px] p-5"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{entry!.manga.universe}</p>
              <h4 className="mt-3 text-2xl font-semibold text-white">{entry!.manga.title}</h4>
              <p className="mt-2 text-sm text-stone-300">{entry!.chapter.title}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.26em] text-stone-500">
                Resume at page {entry!.pageIndex + 1}
              </p>
            </Link>
          ))
        ) : (
          <div className="panel rounded-[28px] p-5 text-sm leading-7 text-stone-300">
            Keep reading and your recent chapters will stack here for faster re-entry.
          </div>
        )}
      </div>
    </div>
  );
}
