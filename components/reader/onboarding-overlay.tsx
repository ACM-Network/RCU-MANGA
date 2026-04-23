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
    <div className="pointer-events-none absolute inset-0 z-40 bg-black/38">
      <div className="absolute inset-x-0 bottom-[16svh] flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-white/8 blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center text-5xl text-white/90 animate-[readerHandSwipe_1.2s_ease-in-out_infinite]">
            &#9757;
          </div>
        </div>
        <p className="text-sm font-medium tracking-[0.12em] text-white/90">
          Swipe or tap edges to navigate
        </p>
      </div>
    </div>
  );
}
