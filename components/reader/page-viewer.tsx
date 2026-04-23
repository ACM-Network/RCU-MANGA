"use client";

import { useEffect, useMemo, useRef } from "react";

import { ReaderPageCanvas } from "@/components/reader/reader-page-canvas";
import { preloadPageAsset } from "@/lib/reader/page-assets";
import type { ChapterPageAsset } from "@/lib/types";

interface PageViewerProps {
  pages: ChapterPageAsset[];
  title: string;
  currentPage: number;
  previewShift: number;
  viewerId: string;
  viewerLabel: string;
  preferProtected: boolean;
  interactionLocked: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onToggleUi: () => void;
  onInteract: () => void;
  onLongPress: () => void;
  onDoubleTap: (point: { x: number; y: number }) => void;
}

interface GestureState {
  x: number;
  y: number;
  moved: boolean;
  longPressTriggered: boolean;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("button, a, input, textarea, select"))
    : false;
}

export function PageViewer({
  pages,
  title,
  currentPage,
  previewShift,
  viewerId,
  viewerLabel,
  preferProtected,
  interactionLocked,
  onNext,
  onPrevious,
  onToggleUi,
  onInteract,
  onLongPress,
  onDoubleTap,
}: PageViewerProps) {
  const gestureRef = useRef<GestureState | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);

  const visiblePages = useMemo(
    () =>
      [currentPage - 1, currentPage, currentPage + 1].filter(
        (index): index is number => index >= 0 && index < pages.length,
      ),
    [currentPage, pages.length],
  );

  useEffect(() => {
    const preloadTargets = [currentPage - 1, currentPage + 1, currentPage + 2]
      .filter((index) => index >= 0 && index < pages.length)
      .map((index) => pages[index]);

    preloadTargets.forEach((page) => {
      preloadPageAsset(page, {
        preferProtected,
        viewerId,
      });
    });
  }, [currentPage, pages, preferProtected, viewerId]);

  function clearLongPress() {
    if (longPressTimeoutRef.current) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    gestureRef.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
      longPressTriggered: false,
    };

    clearLongPress();

    longPressTimeoutRef.current = window.setTimeout(() => {
      if (!gestureRef.current || interactionLocked) {
        return;
      }

      gestureRef.current.longPressTriggered = true;
      onInteract();
      onLongPress();
    }, 420);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!gestureRef.current) {
      return;
    }

    const deltaX = Math.abs(event.clientX - gestureRef.current.x);
    const deltaY = Math.abs(event.clientY - gestureRef.current.y);

    if (deltaX > 12 || deltaY > 12) {
      gestureRef.current.moved = true;
      clearLongPress();
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    clearLongPress();

    if (!gesture || isInteractiveTarget(event.target)) {
      return;
    }

    onInteract();

    if (gesture.longPressTriggered || interactionLocked) {
      return;
    }

    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;

    const now = Date.now();
    const lastTap = lastTapRef.current;
    const tapDistance = lastTap
      ? Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y)
      : Number.POSITIVE_INFINITY;

    if (!gesture.moved && lastTap && now - lastTap.time < 260 && tapDistance < 36) {
      lastTapRef.current = null;
      onDoubleTap({ x: event.clientX, y: event.clientY });
      return;
    }

    if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrevious();
      }

      return;
    }

    if (gesture.moved) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const tapRatio = (event.clientX - bounds.left) / bounds.width;

    lastTapRef.current = {
      time: now,
      x: event.clientX,
      y: event.clientY,
    };

    if (tapRatio < 0.3) {
      onPrevious();
      return;
    }

    if (tapRatio > 0.7) {
      onNext();
      return;
    }

    onToggleUi();
  }

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-black select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        gestureRef.current = null;
        clearLongPress();
      }}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        className={`absolute inset-0 transition duration-300 ${interactionLocked ? "scale-[0.985] blur-sm" : "scale-100 blur-0"}`}
      >
        {visiblePages.map((index) => {
          const offset = index - currentPage;
          const translateX = offset * 100 + previewShift;
          const rotateY = offset * -12;
          const scale = index === currentPage ? 1 : 0.94;

          return (
            <div
              key={pages[index].id}
              className="absolute inset-0 origin-center px-3 py-3 transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:py-5"
              style={{
                transform: `translate3d(${translateX}%, 0, 0) rotateY(${rotateY}deg) scale(${scale})`,
              }}
            >
              <div className="relative h-full overflow-hidden rounded-[28px] bg-[#05050a] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                <ReaderPageCanvas
                  page={pages[index]}
                  pageIndex={index}
                  title={title}
                  viewerId={viewerId}
                  viewerLabel={viewerLabel}
                  preferProtected={preferProtected}
                  active={index === currentPage}
                />
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.52))]" />
    </div>
  );
}
