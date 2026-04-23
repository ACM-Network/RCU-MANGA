"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface PageViewerProps {
  images: string[];
  title: string;
  currentPage: number;
  previewShift: number;
  onNext: () => void;
  onPrevious: () => void;
  onToggleUi: () => void;
  onInteract: () => void;
}

interface GestureState {
  x: number;
  y: number;
  moved: boolean;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest("button, a, input, textarea, select"))
    : false;
}

export function PageViewer({
  images,
  title,
  currentPage,
  previewShift,
  onNext,
  onPrevious,
  onToggleUi,
  onInteract,
}: PageViewerProps) {
  const gestureRef = useRef<GestureState | null>(null);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});
  const [retryMap, setRetryMap] = useState<Record<number, number>>({});

  const visiblePages = useMemo(() => {
    return [currentPage - 1, currentPage, currentPage + 1].filter(
      (index): index is number => index >= 0 && index < images.length,
    );
  }, [currentPage, images.length]);

  useEffect(() => {
    const preloadTargets = images.slice(currentPage + 1, currentPage + 3);

    preloadTargets.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, [currentPage, images]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    gestureRef.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!gestureRef.current) return;

    const deltaX = Math.abs(event.clientX - gestureRef.current.x);
    const deltaY = Math.abs(event.clientY - gestureRef.current.y);

    if (deltaX > 12 || deltaY > 12) {
      gestureRef.current.moved = true;
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    gestureRef.current = null;

    if (!gesture) return;
    if (isInteractiveTarget(event.target)) return;

    onInteract();

    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) onNext();
      if (deltaX > 0) onPrevious();
      return;
    }

    if (gesture.moved) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const tapRatio = (event.clientX - bounds.left) / bounds.width;

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

  function retryImage(index: number) {
    setErrorMap((current) => ({ ...current, [index]: false }));
    setLoadedMap((current) => ({ ...current, [index]: false }));
    setRetryMap((current) => ({ ...current, [index]: (current[index] ?? 0) + 1 }));
  }

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-black select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        gestureRef.current = null;
      }}
    >
      {visiblePages.map((index) => {
        const src = retryMap[index] ? `${images[index]}?retry=${retryMap[index]}` : images[index];
        const loaded = loadedMap[index];
        const failed = errorMap[index];
        const translateX = (index - currentPage) * 100 + previewShift;

        return (
          <div
            key={`${images[index]}-${index}`}
            className="absolute inset-0 flex items-center justify-center bg-black transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${translateX}%, 0, 0)` }}
          >
            {!loaded && !failed ? (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-white/[0.04] via-transparent to-black" />
            ) : null}

            {failed ? (
              <div className="flex flex-col items-center gap-4 px-6 text-center text-white">
                <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">Page failed to load</p>
                <button
                  type="button"
                  onClick={() => retryImage(index)}
                  className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:bg-white/12"
                >
                  Retry
                </button>
              </div>
            ) : (
              <Image
                src={src}
                alt={`${title} page ${index + 1}`}
                fill
                priority={index === currentPage || index === currentPage + 1}
                loading={index <= currentPage + 2 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-contain transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => {
                  setLoadedMap((current) => ({ ...current, [index]: true }));
                }}
                onError={() => {
                  setErrorMap((current) => ({ ...current, [index]: true }));
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
