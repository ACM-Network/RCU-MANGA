"use client";

import { Skeleton } from "@/components/ui/skeleton";

export interface AccountStats {
  totalChaptersRead: number;
  bookmarkedManga: number;
  likedChapters: number;
  lastReadManga: {
    title: string;
    chapterTitle: string;
    updatedAt: string;
  } | null;
}

interface StatsCardProps {
  stats: AccountStats;
  loading?: boolean;
}

function formatReadDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function StatsCard({ stats, loading = false }: StatsCardProps) {
  const metrics = [
    {
      label: "Chapters Read",
      value: stats.totalChaptersRead,
    },
    {
      label: "Bookmarked",
      value: stats.bookmarkedManga,
    },
    {
      label: "Liked Chapters",
      value: stats.likedChapters,
    },
  ];

  if (loading) {
    return (
      <section className="panel rounded-[32px] p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-[24px]" />
          ))}
        </div>
        <Skeleton className="mt-5 h-24 rounded-[24px]" />
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden rounded-[32px] p-5 sm:p-6">
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="card-hover rounded-[24px] border border-white/8 bg-white/[0.035] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 sm:text-[11px]">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[24px] border border-white/8 bg-[#0d0f14]/72 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Last Read Manga</p>
          {stats.lastReadManga ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-stone-300">
              {formatReadDate(stats.lastReadManga.updatedAt)}
            </span>
          ) : null}
        </div>

        {stats.lastReadManga ? (
          <div className="mt-4">
            <h3 className="truncate text-2xl font-semibold text-white">
              {stats.lastReadManga.title}
            </h3>
            <p className="mt-2 truncate text-sm text-stone-300">
              {stats.lastReadManga.chapterTitle}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Your next opened chapter will appear here.
          </p>
        )}
      </div>
    </section>
  );
}
