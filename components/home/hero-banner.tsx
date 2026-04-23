"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import type { Manga } from "@/lib/types";

export function HeroBanner({ manga }: { manga: Manga[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (manga.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % manga.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [manga.length]);

  const active = manga[activeIndex] ?? manga[0];
  const latestChapter = active.chapters[active.chapters.length - 1];

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-black/30">
      <div className="ambient-orb left-[-40px] top-10 h-52 w-52 bg-rose-500/30 animate-pulse-glow" />
      <div className="ambient-orb right-[-20px] top-24 h-56 w-56 bg-fuchsia-600/25 animate-drift" />
      <div className="ambient-orb bottom-6 right-40 h-44 w-44 bg-orange-500/15" />

      <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-12 lg:py-12">
        <div className="relative z-10 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs uppercase tracking-[0.48em] text-rose-400">Featured Premiere</p>
              <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-rose-200">
                Auto Rotation
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="section-title max-w-4xl text-5xl leading-[0.92] text-white sm:text-6xl lg:text-8xl">
                <span className="block">{active.title}</span>
                <span className="mt-3 block text-gradient text-2xl sm:text-3xl lg:text-4xl">
                  {active.tagline}
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg">{active.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {active.genre.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href={`/read/${active.slug}/${latestChapter.id}`}>Start Reading</ButtonLink>
            <ButtonLink href={`/manga/${active.slug}`} variant="secondary">
              Explore Series
            </ButtonLink>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
              <p className="uppercase tracking-[0.24em] text-zinc-400">Latest Drop</p>
              <p className="mt-1 font-medium text-white">{latestChapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {manga.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-10 bg-rose-500" : "w-2.5 bg-white/25 hover:bg-white/40"
                }`}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[440px] overflow-hidden rounded-[30px] border border-white/8 bg-white/5">
          <Image
            key={active.heroImage}
            src={active.heroImage}
            alt={active.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,43,85,0.18),transparent_36%)]" />
          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.42em] text-zinc-300">{active.universe}</p>
            <div className="flex items-end justify-between gap-4">
              <h2 className="section-title text-3xl text-white">{active.title}</h2>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-300">{active.updatedLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
