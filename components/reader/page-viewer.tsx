"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface PageViewerProps {
  images: string[];
  title: string;
  currentPage: number;
  onNext: () => void;
  onPrevious: () => void;
  onToggleUi: () => void;
}

interface GestureState {
  x: number;
  y: number;
  moved: boolean;
}

export function PageViewer({
  images,
  title,
  currentPage,
  onNext,
  onPrevious,
  onToggleUi,
}: PageViewerProps) {
  const gestureRef = useRef<GestureState | null>(null);

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
      <div
        className="flex h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(-${currentPage * 100}%, 0, 0)` }}
      >
        {images.map((src, index) => {
          const shouldRender = Math.abs(index - currentPage) <= 2;

          return (
            <div
              key={`${src}-${index}`}
              className="relative flex h-[100svh] min-w-full items-center justify-center bg-black"
            >
              {shouldRender ? (
                <Image
                  src={src}
                  alt={`${title} page ${index + 1}`}
                  fill
                  priority={index === currentPage || index === currentPage + 1}
                  loading={index <= currentPage + 2 ? "eager" : "lazy"}
                  sizes="100vw"
                  className="object-contain"
                />
              ) : (
                <div className="h-full w-full bg-black" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
