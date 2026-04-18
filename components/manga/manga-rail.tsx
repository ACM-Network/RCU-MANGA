import { PosterCard } from "@/components/manga/poster-card";
import type { Manga } from "@/lib/types";

interface MangaRailProps {
  items: Manga[];
}

export function MangaRail({ items }: MangaRailProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((entry) => (
        <PosterCard key={entry.id} manga={entry} />
      ))}
    </div>
  );
}
