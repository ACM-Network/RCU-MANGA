"use client";

import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface ContinueReadingItem {
  mangaSlug: string;
  mangaTitle: string;
  coverImage: string;
  universe: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  pageIndex: number;
  totalPages: number;
  progress: number;
  updatedAt: string;
}

interface ContinueReadingProps {
  items: ContinueReadingItem[];
  loading?: boolean;
  clearing?: boolean;
  onClearHistory?: () => void | Promise<void>;
}

function progressPercent(progress: number) {
  return Math.max(0, Math.min(100, Math.round(progress * 100)));
}

function currentPageLabel(item: ContinueReadingItem) {
  const totalPages = Math.max(item.totalPages, 1);
  const currentPage = Math.max(1, Math.min(totalPages, item.pageIndex + 1));

  return `Page ${currentPage}/${totalPages}`;
}

export function ContinueReading({
  items,
  loading = false,
  clearing = false,
  onClearHistory,
}: ContinueReadingProps) {
  if (loading) {
    return (
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[32px] p-5 sm:p-6">
          <Skeleton className="h-5 w-44 rounded-full" />
          <Skeleton className="mt-5 h-56 rounded-[26px]" />
          <Skeleton className="mt-5 h-3 w-full rounded-full" />
          <Skeleton className="mt-5 h-12 w-44 rounded-full" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-[28px]" />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="panel rounded-[32px] p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.34em] text-amber-100/80">Continue Reading</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">No active chapter yet.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
          Start any manga chapter and your page progress will appear here.
        </p>
        <div className="mt-6">
          <ButtonLink href="/library">Find a Chapter</ButtonLink>
        </div>
      </section>
    );
  }

  const current = items[0];
  const queue = items.slice(1, 3);
  const percent = progressPercent(current.progress);
  const fillWidth = percent > 0 ? Math.max(6, percent) : 0;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <article className="panel glow-border overflow-hidden rounded-[32px] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-amber-100/80">
              Continue Reading
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-stone-500">
              {currentPageLabel(current)} - {percent}% complete
            </p>
          </div>
          {onClearHistory ? (
            <button
              type="button"
              disabled={clearing}
              onClick={() => void onClearHistory()}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-200 transition hover:border-rose-300/30 hover:bg-rose-300/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearing ? "Clearing" : "Clear History"}
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
          <Link
            href={`/manga/${current.mangaSlug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-[26px] border border-white/10"
          >
            <Image
              src={current.coverImage}
              alt={current.mangaTitle}
              fill
              sizes="(max-width: 640px) 80vw, 180px"
              className="object-cover transition duration-500 group-hover:scale-[1.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-transparent to-transparent" />
          </Link>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{current.universe}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {current.mangaTitle}
            </h2>
            <p className="mt-3 text-base text-stone-200">
              Chapter {current.chapterNumber}: {current.chapterTitle}
            </p>

            <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff8454_0%,#ffd369_48%,#74d3d0_100%)] transition-[width] duration-700 ease-out"
                style={{ width: `${fillWidth}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/read/${current.mangaSlug}/${current.chapterId}`}>
                Resume Chapter
              </ButtonLink>
              <ButtonLink href={`/manga/${current.mangaSlug}`} variant="secondary">
                View Manga
              </ButtonLink>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4">
        {queue.length ? (
          queue.map((item) => (
            <Link
              key={`${item.mangaSlug}-${item.chapterId}`}
              href={`/read/${item.mangaSlug}/${item.chapterId}`}
              className="panel card-hover group grid grid-cols-[88px_1fr] gap-4 overflow-hidden rounded-[28px] p-4"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] border border-white/10">
                <Image
                  src={item.coverImage}
                  alt={item.mangaTitle}
                  fill
                  sizes="88px"
                  className="object-cover transition duration-500 group-hover:scale-[1.08]"
                />
              </div>
              <div className="min-w-0 self-center">
                <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  {currentPageLabel(item)}
                </p>
                <h3 className="mt-2 truncate text-xl font-semibold text-white">{item.mangaTitle}</h3>
                <p className="mt-1 truncate text-sm text-stone-300">{item.chapterTitle}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-200/80 transition-[width] duration-500"
                    style={{ width: `${Math.max(6, progressPercent(item.progress))}%` }}
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="panel rounded-[28px] p-5 text-sm leading-7 text-stone-300">
            Recent chapters will stack here as you move between series.
          </div>
        )}
      </div>
    </section>
  );
}
