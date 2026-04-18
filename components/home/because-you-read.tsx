"use client";

import { useMemo } from "react";

import { PosterCard } from "@/components/manga/poster-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserLibrary } from "@/hooks/use-user-library";
import { mangaLibrary } from "@/lib/content";

export function BecauseYouRead() {
  const { profile, loading } = useUserLibrary();

  const recommendations = useMemo(() => {
    const lastRead = Object.values(profile.readingHistory).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    )[0];

    if (!lastRead) return [];

    const sourceManga = mangaLibrary.find((entry) => entry.slug === lastRead.mangaSlug);
    if (!sourceManga) return [];

    return mangaLibrary
      .filter((entry) => entry.slug !== sourceManga.slug)
      .map((entry) => {
        const sharedGenres = entry.genre.filter((genre) => sourceManga.genre.includes(genre)).length;
        const sameUniverse = entry.universe === sourceManga.universe ? 3 : 0;
        return {
          manga: entry,
          score: sharedGenres * 2 + sameUniverse + entry.trendingScore / 100,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.manga);
  }, [profile.readingHistory]);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03] p-3">
            <Skeleton className="aspect-[3/4] rounded-[22px]" />
            <Skeleton className="mt-4 h-6 w-2/3" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="panel rounded-[28px] p-6 text-zinc-300">
        Read a few chapters and this rail will start suggesting similar manga from your current taste.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {recommendations.map((entry) => (
        <PosterCard key={entry.id} manga={entry} />
      ))}
    </div>
  );
}
