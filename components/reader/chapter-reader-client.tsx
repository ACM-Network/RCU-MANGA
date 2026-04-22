"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ReaderChrome } from "@/components/reader/reader-chrome";
import { ReaderPanel } from "@/components/reader/reader-panel";
import { useUserLibrary } from "@/hooks/use-user-library";
import type { Chapter, Manga } from "@/lib/types";

const ChapterComments = dynamic(
  () => import("@/components/comments/chapter-comments").then((module) => module.ChapterComments),
  {
    loading: () => (
      <div className="rounded-[30px] border border-white/8 bg-white/[0.03] p-6 text-zinc-300">
        Loading chapter discussion...
      </div>
    ),
  },
);

interface ChapterReaderClientProps {
  manga: Manga;
  chapter: Chapter;
  previous: Chapter | null;
  next: Chapter | null;
}

interface LocalReaderProgress {
  mangaSlug: string;
  chapterId: string;
  panelIndex: number;
  scrollOffset: number;
  progress: number;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, button, a, [contenteditable='true']"));
}

export function ChapterReaderClient({
  manga,
  chapter,
  previous,
  next,
}: ChapterReaderClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentPanelRef = useRef(1);
  const lastSavedIndexRef = useRef(-1);
  const hasRestoredPositionRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showNextCta, setShowNextCta] = useState(false);
  const { profile, saveProgress } = useUserLibrary();

  const localProgressKey = useMemo(
    () => `rcpu-reader-progress:${manga.slug}:${chapter.id}`,
    [chapter.id, manga.slug],
  );

  const writeLocalProgress = useCallback(
    (entry: LocalReaderProgress) => {
      window.localStorage.setItem(localProgressKey, JSON.stringify(entry));
    },
    [localProgressKey],
  );

  const readLocalProgress = useCallback(() => {
    const raw = window.localStorage.getItem(localProgressKey);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as LocalReaderProgress;
      return parsed.mangaSlug === manga.slug && parsed.chapterId === chapter.id ? parsed : null;
    } catch {
      return null;
    }
  }, [chapter.id, localProgressKey, manga.slug]);

  useEffect(() => {
    const targets = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-panel-index]") ?? [],
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number((visible.target as HTMLElement).dataset.panelIndex ?? 0);
        if (lastSavedIndexRef.current === index) return;

        lastSavedIndexRef.current = index;
        currentPanelRef.current = index + 1;
        const nextProgress = clampProgress((index + 1) / chapter.images.length);

        setCurrentPanel(index + 1);
        setProgress((current) => (Math.abs(current - nextProgress) > 0.005 ? nextProgress : current));

        void saveProgress(
          manga.slug,
          chapter.id,
          index,
          Math.max(0, Math.round(window.scrollY)),
          nextProgress,
        );
      },
      {
        threshold: [0.35, 0.6, 0.9],
        rootMargin: "-8% 0px -20% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [chapter.id, chapter.images.length, manga.slug, saveProgress]);

  const savedProgress =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.progress ?? 0
      : 0;
  const savedPanelIndex =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.panelIndex ?? 0
      : 0;
  const savedScrollOffset =
    profile.readingHistory[manga.slug]?.chapterId === chapter.id
      ? profile.readingHistory[manga.slug]?.scrollOffset ?? 0
      : 0;

  useEffect(() => {
    let frame = 0;
    let lastWrite = 0;

    const updateScrollProgress = () => {
      frame = 0;
      const node = containerRef.current;
      if (!node) return;

      const start = node.offsetTop;
      const end = start + node.scrollHeight - window.innerHeight;
      const nextProgress = clampProgress((window.scrollY - start) / Math.max(1, end - start));
      const scrollOffset = Math.max(0, Math.round(window.scrollY));

      setProgress((current) => (Math.abs(current - nextProgress) > 0.005 ? nextProgress : current));
      setShowNextCta(nextProgress > 0.96);

      const now = window.performance.now();
      if (now - lastWrite > 800) {
        lastWrite = now;
        writeLocalProgress({
          mangaSlug: manga.slug,
          chapterId: chapter.id,
          panelIndex: Math.max(0, currentPanelRef.current - 1),
          scrollOffset,
          progress: nextProgress,
        });
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapter.id, manga.slug, writeLocalProgress]);

  useEffect(() => {
    if (hasRestoredPositionRef.current) return;

    const restore = window.requestAnimationFrame(() => {
      const localProgress = readLocalProgress();
      const panelIndex = localProgress?.panelIndex ?? savedPanelIndex;
      const scrollOffset = localProgress?.scrollOffset ?? savedScrollOffset;

      if (!scrollOffset && panelIndex === 0) return;

      const targetPanel = containerRef.current?.querySelector<HTMLElement>(
        `[data-panel-index="${panelIndex}"]`,
      );

      const top = Math.max(scrollOffset || (targetPanel?.offsetTop ?? 0) - 120, 0);
      window.scrollTo({ top, behavior: "auto" });
      hasRestoredPositionRef.current = true;
    });

    return () => window.cancelAnimationFrame(restore);
  }, [readLocalProgress, savedPanelIndex, savedScrollOffset]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      if (event.key === "ArrowRight" && next) {
        event.preventDefault();
        router.push(`/manga/${manga.slug}/chapter/${next.id}`);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        router.push(previous ? `/manga/${manga.slug}/chapter/${previous.id}` : `/manga/${manga.slug}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [manga.slug, next, previous, router]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((current) => Math.min(1.2, Number((current + 0.1).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((current) => Math.max(0.9, Number((current - 0.1).toFixed(2))));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

  const displayedProgress = progress > 0 ? Math.max(progress, savedProgress) : savedProgress;
  const displayedPanel =
    progress > 0 ? currentPanel : Math.min(chapter.images.length, Math.max(1, savedPanelIndex + 1));
  const readerWidth = useMemo(
    () => `${Math.round(42 + (zoomLevel - 0.9) * 42)}rem`,
    [zoomLevel],
  );

  return (
    <div ref={containerRef} className="reader-mode min-h-screen overscroll-y-contain">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8">
        <ReaderChrome
          manga={manga}
          chapter={chapter}
          progress={displayedProgress}
          currentPanel={displayedPanel}
          totalPanels={chapter.images.length}
          zoomLevel={zoomLevel}
          next={next}
          showNextCta={showNextCta}
          onBack={() => window.history.back()}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
          onZoomReset={handleZoomReset}
        />

        <div className="mx-auto w-full transition-[max-width] duration-200" style={{ maxWidth: readerWidth }}>
          <div className="space-y-4 sm:space-y-5">
            {chapter.images.map((image, index) => (
              <ReaderPanel
                key={`${chapter.id}-${image}-${index}`}
                index={index}
                src={image}
                alt={`${manga.title} ${chapter.title} panel ${index + 1}`}
                priority={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-[26px] border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-3 sm:gap-4 sm:p-5">
          <Link
            href={`/manga/${manga.slug}`}
            className="rounded-[22px] border border-white/8 bg-black/30 p-4 transition hover:bg-white/5 sm:p-5"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Browse</p>
            <p className="mt-2 section-title text-2xl text-white">Back to Library</p>
          </Link>

          {previous ? (
            <Link
              href={`/manga/${manga.slug}/chapter/${previous.id}`}
              className="rounded-[22px] border border-white/8 bg-black/30 p-4 transition hover:bg-white/5 sm:p-5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Previous</p>
              <p className="mt-2 section-title text-2xl text-white">{previous.title}</p>
            </Link>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/8 p-4 text-zinc-400 sm:p-5">
              Beginning of this manga run.
            </div>
          )}

          {next ? (
            <Link
              href={`/manga/${manga.slug}/chapter/${next.id}`}
              className="rounded-[22px] border border-rose-500/20 bg-rose-500/8 p-4 transition hover:bg-rose-500/12 sm:p-5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-rose-300">Next Chapter</p>
              <p className="mt-2 section-title text-2xl text-white">{next.title}</p>
            </Link>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/8 p-4 text-zinc-400 sm:p-5">
              Latest available chapter. Check the library for fresh drops.
            </div>
          )}
        </div>

        <ChapterComments chapterId={chapter.id} />
      </div>
    </div>
  );
}
