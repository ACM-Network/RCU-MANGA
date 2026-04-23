"use client";

import { useMemo } from "react";

import { PosterCard } from "@/components/manga/poster-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserLibrary } from "@/hooks/use-user-library";
import { getTrendingManga } from "@/lib/content";
import { getBecauseYouReadRecommendations } from "@/lib/recommendations";

export function BecauseYouRead() {
  const { profile, loading } = useUserLibrary();

  const recommendations = useMemo(() => {
    const history = Object.values(profile.readingHistory);

    if (!history.length) {
      return getTrendingManga().slice(0, 4);
    }

    const computed = getBecauseYouReadRecommendations(history, 4);
    return computed.length ? computed : getTrendingManga().slice(0, 4);
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
      <div className="panel rounded-[28px] p-6 text-stone-300">
        Read a few chapters and this rail will pivot from featured picks to personal recommendations.
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
