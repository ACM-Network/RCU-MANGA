"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseReaderOptions {
  totalPages: number;
  initialPage: number;
  ready: boolean;
  isAuthenticated: boolean;
  previousChapterHref: string | null;
  nextChapterHref: string | null;
  onPageChange: (page: number) => Promise<void> | void;
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page) || totalPages <= 0) {
    return 0;
  }

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
  isAuthenticated,
  previousChapterHref,
  nextChapterHref,
  onPageChange,
}: UseReaderOptions) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const hydratedRef = useRef(false);
  const lockedPageRef = useRef<number | null>(null);

  const guestPageLimit = Math.max(1, Math.ceil(totalPages / 2));
  const maxGuestPageIndex = Math.max(0, guestPageLimit - 1);

  const attemptPage = useCallback(
    (page: number) => {
      const targetPage = clampPage(page, totalPages);

      if (!isAuthenticated && targetPage > maxGuestPageIndex) {
        lockedPageRef.current = targetPage;
        setPaywallVisible(true);
        setUiVisible(true);
        return;
      }

      setCurrentPage((current) => (targetPage === current ? current : targetPage));
    },
    [isAuthenticated, maxGuestPageIndex, totalPages],
  );

  const goNext = useCallback(() => {
    setCurrentPage((current) => {
      const target = current + 1;

      if (!isAuthenticated && target > maxGuestPageIndex) {
        lockedPageRef.current = target;
        setPaywallVisible(true);
        setUiVisible(true);
        return current;
      }

      if (target < totalPages) {
        return target;
      }

      if (nextChapterHref) {
        router.push(nextChapterHref);
      }

      return current;
    });
  }, [isAuthenticated, maxGuestPageIndex, nextChapterHref, router, totalPages]);

  const goPrevious = useCallback(() => {
    setCurrentPage((current) => {
      if (current > 0) {
        return current - 1;
      }

      if (previousChapterHref) {
        router.push(previousChapterHref);
      }

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

  const openQuickMenu = useCallback(() => {
    setQuickMenuOpen(true);
    setUiVisible(true);
  }, []);

  const closeQuickMenu = useCallback(() => {
    setQuickMenuOpen(false);
  }, []);

  const closePaywall = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  useEffect(() => {
    if (!ready || hydratedRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const startPage = isAuthenticated
        ? clampPage(initialPage, totalPages)
        : clampPage(Math.min(initialPage, maxGuestPageIndex), totalPages);

      setCurrentPage(startPage);
      hydratedRef.current = true;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialPage, isAuthenticated, maxGuestPageIndex, ready, totalPages]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    void onPageChange(currentPage);
  }, [currentPage, onPageChange, ready]);

  useEffect(() => {
    if (!ready || !isAuthenticated || lockedPageRef.current === null) {
      return;
    }

    const target = clampPage(lockedPageRef.current, totalPages);
    const frameId = window.requestAnimationFrame(() => {
      lockedPageRef.current = null;
      setPaywallVisible(false);
      setCurrentPage(target);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isAuthenticated, ready, totalPages]);

  useEffect(() => {
    if (!uiVisible || quickMenuOpen || paywallVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUiVisible(false);
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [currentPage, paywallVisible, quickMenuOpen, uiVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isInteractiveTarget(event.target) || paywallVisible) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setQuickMenuOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, paywallVisible]);

  return useMemo(
    () => ({
      currentPage,
      totalPages,
      uiVisible,
      quickMenuOpen,
      paywallVisible,
      guestPageLimit,
      progress: totalPages ? (currentPage + 1) / totalPages : 0,
      isFirstPage: currentPage === 0,
      isLastPage: totalPages > 0 && currentPage === totalPages - 1,
      attemptPage,
      goNext,
      goPrevious,
      showUi,
      hideUi,
      toggleUi,
      openQuickMenu,
      closeQuickMenu,
      closePaywall,
    }),
    [
      attemptPage,
      closePaywall,
      closeQuickMenu,
      currentPage,
      goNext,
      goPrevious,
      guestPageLimit,
      hideUi,
      openQuickMenu,
      paywallVisible,
      quickMenuOpen,
      showUi,
      toggleUi,
      totalPages,
      uiVisible,
    ],
  );
}
