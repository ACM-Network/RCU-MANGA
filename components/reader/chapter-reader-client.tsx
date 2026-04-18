"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChapterComments } from "@/components/comments/chapter-comments";
import { Button } from "@/components/ui/button";
import { useUserLibrary } from "@/hooks/use-user-library";
import type { Chapter, Manga } from "@/lib/types";
import { formatChapterNumber } from "@/lib/utils";

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
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
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
        const nextProgress = (index + 1) / chapter.images.length;
        setProgress(nextProgress);
        void saveProgress(manga.slug, chapter.id, nextProgress);
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
      gainRef.current?.gain.linearRampToValueAtTime(0.0001, (audioRef.current?.currentTime ?? 0) + 0.2);
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

  const chapterLabel = useMemo(
    () => `${formatChapterNumber(chapter.number)} - ${chapter.title}`,
    [chapter.number, chapter.title],
  );

  async function toggleFullscreen() {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setCinematic(false);
      return;
    }

    await containerRef.current.requestFullscreen();
    setCinematic(true);
  }

  return (
    <div ref={containerRef} className="reader-mode min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:py-8">
        <div className="sticky top-20 z-30 rounded-[28px] border border-white/8 bg-black/55 p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-rose-400">{manga.universe}</p>
              <h1 className="section-title mt-2 text-2xl text-white sm:text-3xl">{manga.title}</h1>
              <p className="mt-2 text-sm text-zinc-300">{chapterLabel}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => void toggleLikedChapter(chapter.id)}>
                {isLiked ? "Unlike Chapter" : "Like Chapter"}
              </Button>
              <Button variant="secondary" onClick={() => setMusicOn((current) => !current)}>
                {musicOn ? "Music Off" : "Music On"}
              </Button>
              <Button onClick={() => void toggleFullscreen()}>
                {cinematic ? "Exit Cinematic" : "Cinematic Mode"}
              </Button>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-violet-600 transition-all duration-300"
              style={{ width: `${Math.max(6, progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-5">
          {chapter.images.map((image, index) => (
            <figure
              key={`${chapter.id}-${image}-${index}`}
              data-panel-index={index}
              className="overflow-hidden rounded-[32px] border border-white/8 bg-black/40"
            >
              <Image
                src={image}
                alt={`${manga.title} ${chapter.title} panel ${index + 1}`}
                width={1400}
                height={2400}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 920px"
                className="h-auto w-full object-cover"
              />
            </figure>
          ))}
        </div>

        <div className="grid gap-4 rounded-[30px] border border-white/8 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
          {previous ? (
            <Link
              href={`/manga/${manga.slug}/chapter/${previous.id}`}
              className="rounded-[24px] border border-white/8 bg-black/30 p-5 transition hover:bg-white/5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Previous</p>
              <p className="mt-2 section-title text-2xl text-white">{previous.title}</p>
            </Link>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/8 p-5 text-zinc-400">
              Beginning of this manga run.
            </div>
          )}

          {next ? (
            <Link
              href={`/manga/${manga.slug}/chapter/${next.id}`}
              className="rounded-[24px] border border-white/8 bg-black/30 p-5 transition hover:bg-white/5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Next</p>
              <p className="mt-2 section-title text-2xl text-white">{next.title}</p>
            </Link>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/8 p-5 text-zinc-400">
              Latest available chapter. Check the library for fresh drops.
            </div>
          )}
        </div>

        <ChapterComments chapterId={chapter.id} />
      </div>
    </div>
  );
}
