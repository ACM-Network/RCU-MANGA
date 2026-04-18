import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import type { Manga } from "@/lib/types";

export function HeroBanner({ manga }: { manga: Manga }) {
  const latestChapter = manga.chapters[manga.chapters.length - 1];

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/8 bg-black/30">
      <div className="ambient-orb -left-10 top-10 h-44 w-44 bg-rose-500/30" />
      <div className="ambient-orb -right-4 bottom-8 h-52 w-52 bg-violet-700/30 animate-drift" />
      <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-12">
        <div className="relative z-10 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.48em] text-rose-400">Featured Premiere</p>
            <div className="space-y-4">
              <h1 className="section-title max-w-3xl text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                {manga.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg">{manga.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {manga.genre.map((tag) => (
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
            <ButtonLink href={`/manga/${manga.slug}/chapter/${latestChapter.id}`}>Start Reading</ButtonLink>
            <ButtonLink href={`/manga/${manga.slug}`} variant="secondary">
              Explore Series
            </ButtonLink>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
              <p className="uppercase tracking-[0.24em] text-zinc-400">Latest Drop</p>
              <p className="mt-1 font-medium text-white">{latestChapter.title}</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/8 bg-white/5">
          <Image
            src={manga.heroImage}
            alt={manga.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.42em] text-zinc-300">{manga.universe}</p>
            <h2 className="section-title text-3xl text-white">{manga.tagline}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
