"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import type { Manga } from "@/lib/types";

export function HeroBanner({ manga }: { manga: Manga[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (manga.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % manga.length);
    }, 6200);

    return () => window.clearInterval(intervalId);
  }, [manga.length]);

  const active = manga[activeIndex] ?? manga[0];
  const latestChapter = active.chapters[active.chapters.length - 1];

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#111217]/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,129,76,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(92,206,201,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
      <div className="ambient-orb left-[-40px] top-12 h-48 w-48 bg-[#ff8d5a]/25 animate-drift" />
      <div className="ambient-orb right-[-20px] top-8 h-56 w-56 bg-[#7adad0]/16 animate-pulse-glow" />

      <div className="relative grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-amber-100/80">
                Featured Manga
              </span>
              <span className="text-[11px] uppercase tracking-[0.32em] text-stone-400">
                {active.updatedLabel} • {active.universe}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] text-white sm:text-6xl lg:text-7xl">
                {active.title}
              </h1>
              <p className="max-w-2xl text-lg text-amber-100/90">{active.tagline}</p>
              <p className="max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">{active.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {active.genre.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-stone-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/read/${active.slug}/${latestChapter.id}`}>Start Reading</ButtonLink>
            <ButtonLink href={`/manga/${active.slug}`} variant="secondary">
              Explore Series
            </ButtonLink>
            <ButtonLink href="/universe" variant="ghost">
              Enter Universe
            </ButtonLink>
          </div>

          <div className="flex items-center gap-3">
            {manga.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-12 bg-[#ff9157]" : "w-2.5 bg-white/25 hover:bg-white/40"
                }`}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[30px] border border-white/10 bg-black/20">
          <Image
            key={active.heroImage}
            src={active.heroImage}
            alt={active.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-cover transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="rounded-[26px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.34em] text-stone-400">Now Spotlighted</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{active.title}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-400">Latest Chapter</p>
                  <p className="mt-2 text-sm text-white">{latestChapter.title}</p>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-400">Story Status</p>
                  <p className="mt-2 text-sm text-white">{active.status}</p>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-400">Chapter Count</p>
                  <p className="mt-2 text-sm text-white">{active.chapters.length} live chapters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
