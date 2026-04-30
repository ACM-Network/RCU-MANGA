"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GuestPaywall } from "@/components/reader/guest-paywall";
import { OnboardingOverlay } from "@/components/reader/onboarding-overlay";
import { PageViewer } from "@/components/reader/page-viewer";
import { ReaderControls } from "@/components/reader/reader-controls";
import { ReaderQuickMenu } from "@/components/reader/reader-quick-menu";
import { useReader } from "@/hooks/use-reader";
import { useUserLibrary } from "@/hooks/use-user-library";
import type { Chapter, Manga } from "@/lib/types";
import { formatChapterNumber } from "@/lib/utils";

interface ChapterReaderClientProps {
  manga: Manga;
  chapter: Chapter;
  previous: Chapter | null;
  next: Chapter | null;
}

const onboardingStorageKey = "realm-cinematic:onboarding-seen";

export function ChapterReaderClient({
  manga,
  chapter,
  previous,
  next,
}: ChapterReaderClientProps) {
  const {
    profile,
    loading,
    syncMessage,
    isAuthenticated,
    registerChapterView,
    saveProgress,
    toggleLikedChapter,
  } = useUserLibrary();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [previewShift, setPreviewShift] = useState(0);
  const [likeBurst, setLikeBurst] = useState<{ x: number; y: number; key: number } | null>(null);

  const initialPage =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.pageIndex ?? 0
      : 0;

  const previousHref = useMemo(
    () => (previous ? `/read/${manga.slug}/${previous.id}` : null),
    [manga.slug, previous],
  );
  const nextHref = useMemo(() => (next ? `/read/${manga.slug}/${next.id}` : null), [manga.slug, next]);
  const readerTitle = useMemo(() => `${manga.title} ${chapter.title}`, [chapter.title, manga.title]);
  const controlTitle = useMemo(
    () => `${formatChapterNumber(chapter.number)} - ${chapter.title}`,
    [chapter.number, chapter.title],
  );
  const quickMenuTitle = useMemo(() => `${manga.title} • ${chapter.title}`, [chapter.title, manga.title]);
  const handlePageChange = useCallback(
    async (page: number) => {
      const totalPages = Math.max(chapter.pages.length, 1);
      await saveProgress(manga.slug, chapter.id, page, Math.max(0, Math.min(1, (page + 1) / totalPages)));
    },
    [chapter.id, chapter.pages.length, manga.slug, saveProgress],
  );

  const reader = useReader({
    totalPages: chapter.pages.length,
    initialPage,
    ready: !loading,
    isAuthenticated,
    previousChapterHref: previousHref,
    nextChapterHref: nextHref,
    onPageChange: handlePageChange,
  });

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleInteract = useCallback(() => {
    if (showOnboarding) {
      setShowOnboarding(false);
      setPreviewShift(0);
      window.localStorage.setItem(onboardingStorageKey, "true");
    }
  }, [showOnboarding]);

  const handleToggleLike = useCallback(async () => {
    await toggleLikedChapter(chapter.id);
  }, [chapter.id, toggleLikedChapter]);
  const handleQuickMenuToggleLike = useCallback(() => {
    void handleToggleLike();
  }, [handleToggleLike]);

  const handleDoubleTap = useCallback(
    (point: { x: number; y: number }) => {
      setLikeBurst({
        x: point.x,
        y: point.y,
        key: Date.now(),
      });
      void toggleLikedChapter(chapter.id);
    },
    [chapter.id, toggleLikedChapter],
  );
  const handleDismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    setPreviewShift(0);
    window.localStorage.setItem(onboardingStorageKey, "true");
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousBodyTouchAction = document.body.style.touchAction;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;

    const preventDefault = (event: Event) => event.preventDefault();

    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#020204";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("dragstart", preventDefault);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.backgroundColor = previousBodyBackground;
      document.body.style.touchAction = previousBodyTouchAction;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const hasSeenOnboarding = window.localStorage.getItem(onboardingStorageKey) === "true";

    if (!hasSeenOnboarding) {
      const frameId = window.requestAnimationFrame(() => {
        setShowOnboarding(true);
      });

      return () => window.cancelAnimationFrame(frameId);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      void registerChapterView(chapter.id);
    }
  }, [chapter.id, isAuthenticated, loading, registerChapterView]);

  useEffect(() => {
    if (!likeBurst) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLikeBurst(null);
    }, 720);

    return () => window.clearTimeout(timeoutId);
  }, [likeBurst]);

  if (loading) {
    return <div className="h-[100svh] w-full bg-black" />;
  }

  const viewerLabel = profile.email || profile.name || "Preview copy";
  const isChapterLiked = profile.likedChapters.includes(chapter.id);

  return (
    <div className="reader-mode relative h-[100svh] w-full overflow-hidden bg-black">
      <PageViewer
        pages={chapter.pages}
        title={readerTitle}
        currentPage={reader.currentPage}
        previewShift={previewShift}
        viewerLabel={viewerLabel}
        interactionLocked={reader.paywallVisible || reader.quickMenuOpen}
        onNext={reader.goNext}
        onPrevious={reader.goPrevious}
        onToggleUi={reader.toggleUi}
        onInteract={handleInteract}
        onLongPress={reader.openQuickMenu}
        onDoubleTap={handleDoubleTap}
      />

      <ReaderControls
        title={controlTitle}
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        visible={reader.uiVisible}
        onBack={handleBack}
        nextChapterHref={nextHref}
      />

      <OnboardingOverlay
        visible={showOnboarding}
        onDismiss={handleDismissOnboarding}
        onPreviewShift={setPreviewShift}
      />

      <ReaderQuickMenu
        visible={reader.quickMenuOpen}
        chapterTitle={quickMenuTitle}
        mangaHref={`/manga/${manga.slug}`}
        isLiked={isChapterLiked}
        onClose={reader.closeQuickMenu}
        onToggleLike={handleQuickMenuToggleLike}
      />

      <GuestPaywall visible={reader.paywallVisible} onClose={reader.closePaywall} />

      {syncMessage ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.28em] text-stone-200 backdrop-blur-xl">
          {syncMessage}
        </div>
      ) : null}

      {likeBurst ? (
        <div
          key={likeBurst.key}
          className="pointer-events-none absolute z-30 text-3xl text-rose-300 animate-[likeBurst_720ms_ease-out_forwards]"
          style={{
            left: likeBurst.x - 16,
            top: likeBurst.y - 16,
          }}
        >
          ♥
        </div>
      ) : null}
    </div>
  );
}
