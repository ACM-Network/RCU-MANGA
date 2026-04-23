"use client";

import { useCallback } from "react";

import { PageViewer } from "@/components/reader/page-viewer";
import { ReaderControls } from "@/components/reader/reader-controls";
import { useReader } from "@/components/reader/use-reader";
import { useUserLibrary } from "@/hooks/use-user-library";
import type { Chapter, Manga } from "@/lib/types";
import { formatChapterNumber } from "@/lib/utils";

interface ChapterReaderClientProps {
  manga: Manga;
  chapter: Chapter;
  previous: Chapter | null;
  next: Chapter | null;
}

export function ChapterReaderClient({
  manga,
  chapter,
  previous,
  next,
}: ChapterReaderClientProps) {
  const { profile, loading, saveProgress } = useUserLibrary();

  const initialPage =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.panelIndex ?? 0
      : 0;

  const handlePageChange = useCallback(
    async (page: number) => {
      const totalPages = Math.max(chapter.images.length, 1);
      await saveProgress(
        manga.slug,
        chapter.id,
        page,
        0,
        Math.max(0, Math.min(1, (page + 1) / totalPages)),
      );
    },
    [chapter.id, chapter.images.length, manga.slug, saveProgress],
  );

  const reader = useReader({
    totalPages: chapter.images.length,
    initialPage,
    ready: !loading,
    previousChapterHref: previous ? `/manga/${manga.slug}/chapter/${previous.id}` : null,
    nextChapterHref: next ? `/manga/${manga.slug}/chapter/${next.id}` : null,
    onPageChange: handlePageChange,
  });

  if (loading) {
    return <div className="h-[100svh] bg-black" />;
  }

  return (
    <div className="relative h-[100svh] overflow-hidden bg-black">
      <PageViewer
        images={chapter.images}
        title={`${manga.title} ${chapter.title}`}
        currentPage={reader.currentPage}
        onNext={reader.goNext}
        onPrevious={reader.goPrevious}
        onToggleUi={reader.toggleUi}
      />

      <ReaderControls
        title={`${formatChapterNumber(chapter.number)} - ${chapter.title}`}
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        progress={reader.progress}
        visible={reader.uiVisible}
        onBack={() => window.history.back()}
        nextChapterHref={next ? `/manga/${manga.slug}/chapter/${next.id}` : null}
      />
    </div>
  );
}
