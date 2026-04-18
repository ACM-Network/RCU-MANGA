"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { useUserLibrary } from "@/hooks/use-user-library";

interface MangaActionsProps {
  mangaSlug: string;
  firstChapterId: string;
}

export function MangaActions({ mangaSlug, firstChapterId }: MangaActionsProps) {
  const { profile, toggleBookmark } = useUserLibrary();
  const isBookmarked = profile.bookmarks.includes(mangaSlug);

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <ButtonLink href={`/manga/${mangaSlug}/chapter/${firstChapterId}`}>Start Reading</ButtonLink>
      <Button variant="secondary" onClick={() => void toggleBookmark(mangaSlug)}>
        {isBookmarked ? "Remove Bookmark" : "Bookmark Series"}
      </Button>
      <ButtonLink href="/library" variant="secondary">
        Back To Library
      </ButtonLink>
    </div>
  );
}
