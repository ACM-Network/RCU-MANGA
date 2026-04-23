"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { OnboardingOverlay } from "@/components/reader/onboarding-overlay";
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

const onboardingStorageKey = "rcpu-reader-onboarding";

export function ChapterReaderClient({
  manga,
  chapter,
  previous,
  next,
}: ChapterReaderClientProps) {
  const { profile, loading, saveProgress } = useUserLibrary();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [previewShift, setPreviewShift] = useState(0);

  const initialPage =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.panelIndex ?? 0
      : 0;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousBackground = document.body.style.backgroundColor;
    const previousTouchAction = document.body.style.touchAction;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.backgroundColor = previousBackground;
      document.body.style.touchAction = previousTouchAction;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = window.localStorage.getItem(onboardingStorageKey) === "true";
    if (hasSeenOnboarding) return;

    const frame = window.requestAnimationFrame(() => {
      setShowOnboarding(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    setPreviewShift(0);
    window.localStorage.setItem(onboardingStorageKey, "true");
  }, []);

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

  const previousHref = useMemo(
    () => (previous ? `/read/${manga.slug}/${previous.id}` : null),
    [manga.slug, previous],
  );
  const nextHref = useMemo(() => (next ? `/read/${manga.slug}/${next.id}` : null), [manga.slug, next]);

  const reader = useReader({
    totalPages: chapter.images.length,
    initialPage,
    ready: !loading,
    previousChapterHref: previousHref,
    nextChapterHref: nextHref,
    onPageChange: handlePageChange,
  });

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleInteract = useCallback(() => {
    if (showOnboarding) {
      dismissOnboarding();
    }
  }, [dismissOnboarding, showOnboarding]);

  if (loading) {
    return <div className="h-[100svh] w-full bg-black" />;
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-black">
      <PageViewer
        images={chapter.images}
        title={`${manga.title} ${chapter.title}`}
        currentPage={reader.currentPage}
        previewShift={previewShift}
        onNext={reader.goNext}
        onPrevious={reader.goPrevious}
        onToggleUi={reader.toggleUi}
        onInteract={handleInteract}
      />

      <ReaderControls
        title={`${formatChapterNumber(chapter.number)} - ${chapter.title}`}
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        progress={reader.progress}
        visible={reader.uiVisible}
        onBack={handleBack}
        nextChapterHref={nextHref}
      />

      <OnboardingOverlay
        visible={showOnboarding}
        onDismiss={dismissOnboarding}
        onPreviewShift={setPreviewShift}
      />
    </div>
  );
}
