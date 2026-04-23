"use client";

import { useEffect } from "react";

interface OnboardingOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  onPreviewShift: (shift: number) => void;
}

const previewSequence = [0, -8, 0, -12, 0, -10, 0];

export function OnboardingOverlay({
  visible,
  onDismiss,
  onPreviewShift,
}: OnboardingOverlayProps) {
  useEffect(() => {
    if (!visible) return;

    let index = 0;
    onPreviewShift(previewSequence[0]);

    const intervalId = window.setInterval(() => {
      index += 1;
      if (index < previewSequence.length) {
        onPreviewShift(previewSequence[index]);
      }
    }, 320);

    const timeoutId = window.setTimeout(() => {
      onPreviewShift(0);
      onDismiss();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      onPreviewShift(0);
    };
  }, [onDismiss, onPreviewShift, visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 bg-black/58 backdrop-blur-[2px]">
      <div className="absolute inset-x-0 bottom-[18svh] flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative h-24 w-28">
          <div className="absolute left-5 right-5 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/15" />
          <div className="absolute left-[28%] top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 blur-xl" />
          <div className="absolute left-[30%] top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-4xl text-white/90 animate-[readerHandSwipe_1.2s_ease-in-out_infinite]">
            &#9757;
          </div>
        </div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/90">
          Swipe or tap to read
        </p>
      </div>
    </div>
  );
}
