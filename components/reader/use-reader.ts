"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseReaderOptions {
  totalPages: number;
  initialPage: number;
  ready: boolean;
  previousChapterHref: string | null;
  nextChapterHref: string | null;
  onPageChange: (page: number) => Promise<void> | void;
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page)) return 0;
  return Math.max(0, Math.min(totalPages - 1, Math.floor(page)));
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true']"))
    : false;
}

export function useReader({
  totalPages,
  initialPage,
  ready,
  previousChapterHref,
  nextChapterHref,
  onPageChange,
}: UseReaderOptions) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [uiVisible, setUiVisible] = useState(false);
  const hasHydratedPageRef = useRef(false);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage((current) => {
        const nextPage = clampPage(page, totalPages);
        return nextPage === current ? current : nextPage;
      });
    },
    [totalPages],
  );

  const goNext = useCallback(() => {
    setCurrentPage((current) => {
      if (current < totalPages - 1) return current + 1;
      if (nextChapterHref) router.push(nextChapterHref);
      return current;
    });
  }, [nextChapterHref, router, totalPages]);

  const goPrevious = useCallback(() => {
    setCurrentPage((current) => {
      if (current > 0) return current - 1;
      if (previousChapterHref) router.push(previousChapterHref);
      return current;
    });
  }, [previousChapterHref, router]);

  const toggleUi = useCallback(() => {
    setUiVisible((current) => !current);
  }, []);

  const showUi = useCallback(() => {
    setUiVisible(true);
  }, []);

  const hideUi = useCallback(() => {
    setUiVisible(false);
  }, []);

  useEffect(() => {
    if (!ready || hasHydratedPageRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      setCurrentPage(clampPage(initialPage, totalPages));
      hasHydratedPageRef.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialPage, ready, totalPages]);

  useEffect(() => {
    if (!ready) return;
    void onPageChange(currentPage);
  }, [currentPage, onPageChange, ready]);

  useEffect(() => {
    if (!uiVisible) return;

    const timeoutId = window.setTimeout(() => {
      setUiVisible(false);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [currentPage, uiVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  return useMemo(
    () => ({
      currentPage,
      totalPages,
      uiVisible,
      isFirstPage: currentPage === 0,
      isLastPage: currentPage === totalPages - 1,
      progress: totalPages ? (currentPage + 1) / totalPages : 0,
      goToPage,
      goNext,
      goPrevious,
      showUi,
      hideUi,
      toggleUi,
    }),
    [currentPage, goNext, goPrevious, goToPage, hideUi, showUi, toggleUi, totalPages, uiVisible],
  );
}
