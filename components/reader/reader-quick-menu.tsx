"use client";

import Link from "next/link";
import { useState } from "react";

interface ReaderQuickMenuProps {
  visible: boolean;
  chapterTitle: string;
  mangaHref: string;
  isLiked: boolean;
  onClose: () => void;
  onToggleLike: () => void;
}

export function ReaderQuickMenu({
  visible,
  chapterTitle,
  mangaHref,
  isLiked,
  onClose,
  onToggleLike,
}: ReaderQuickMenuProps) {
  const [shareLabel, setShareLabel] = useState("Share Chapter");

  if (!visible) {
    return null;
  }

  async function handleShare() {
    const shareData = {
      title: chapterTitle,
      text: `Resume ${chapterTitle} on Realm Cinematic.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareLabel("Link Copied");
        window.setTimeout(() => setShareLabel("Share Chapter"), 1800);
      }
    } catch {
      return;
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/38 px-4 pb-4 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-[30px] border border-white/10 bg-[#121217]/92 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-stone-400">Quick Menu</p>
            <p className="mt-2 text-base font-medium text-white">{chapterTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition hover:bg-white/10 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onToggleLike}
            className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:bg-white/10"
          >
            {isLiked ? "Unlike Chapter" : "Like Chapter"}
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white transition hover:bg-white/10"
          >
            {shareLabel}
          </button>
          <Link
            href={mangaHref}
            className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white transition hover:bg-white/10"
          >
            View Series
          </Link>
          <Link
            href="/auth"
            className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white transition hover:bg-white/10"
          >
            Account
          </Link>
        </div>
      </div>
    </div>
  );
}
