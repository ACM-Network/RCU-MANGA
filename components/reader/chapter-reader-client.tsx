"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
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

export function ChapterReaderClient({
  manga,
  chapter,
  previous,
  next,
}: ChapterReaderClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cinematic, setCinematic] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lastSavedIndexRef = useRef(-1);
  const hasRestoredPositionRef = useRef(false);
  const { profile, saveProgress, toggleLikedChapter } = useUserLibrary();

  const isLiked = profile.likedChapters.includes(chapter.id);

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
        const nextProgress = (index + 1) / chapter.images.length;

        setCurrentPanel(index + 1);
        setProgress(nextProgress);

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

  useEffect(() => {
    if (!musicOn) {
      gainRef.current?.gain.linearRampToValueAtTime(
        0.0001,
        (audioRef.current?.currentTime ?? 0) + 0.2,
      );
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!audioRef.current) {
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.value = 55;
      gain.gain.value = 0.0001;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();

      audioRef.current = context;
      gainRef.current = gain;
    }

    void audioRef.current.resume();
    gainRef.current?.gain.linearRampToValueAtTime(0.03, audioRef.current.currentTime + 0.4);
  }, [musicOn]);

  useEffect(() => {
    const syncMode = () => setCinematic(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncMode);
    return () => document.removeEventListener("fullscreenchange", syncMode);
  }, []);

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
  const displayedProgress = progress > 0 ? Math.max(progress, savedProgress) : savedProgress;
  const displayedPanel =
    progress > 0 ? currentPanel : Math.min(chapter.images.length, Math.max(1, savedPanelIndex + 1));

  useEffect(() => {
    if (hasRestoredPositionRef.current) return;
    if (!savedScrollOffset && savedPanelIndex === 0) return;

    const restore = window.requestAnimationFrame(() => {
      const targetPanel = containerRef.current?.querySelector<HTMLElement>(
        `[data-panel-index="${savedPanelIndex}"]`,
      );

      if (targetPanel) {
        const top = Math.max(savedScrollOffset || targetPanel.offsetTop - 120, 0);
        window.scrollTo({ top, behavior: "auto" });
        hasRestoredPositionRef.current = true;
      }
    });

    return () => window.cancelAnimationFrame(restore);
  }, [savedPanelIndex, savedScrollOffset]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setCinematic(false);
      return;
    }

    await containerRef.current.requestFullscreen();
    setCinematic(true);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((current) => Math.min(1.2, Number((current + 0.1).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((current) => Math.max(0.9, Number((current - 0.1).toFixed(2))));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

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
          cinematic={cinematic}
          musicOn={musicOn}
          isLiked={isLiked}
          next={next}
          onBack={() => window.history.back()}
          onToggleFullscreen={() => void toggleFullscreen()}
          onToggleMusic={() => setMusicOn((current) => !current)}
          onToggleLike={() => void toggleLikedChapter(chapter.id)}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
          onZoomReset={handleZoomReset}
        />

        <div className="mx-auto w-full" style={{ maxWidth: readerWidth }}>
          <div className="mb-4 rounded-[24px] border border-white/7 bg-black/32 px-4 py-3 text-sm leading-6 text-zinc-300 sm:px-5">
            Vertical reading is optimized for quick resume and low-memory scrolling. Your last
            panel is saved automatically on this device.
          </div>

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
