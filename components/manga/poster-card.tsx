import Image from "next/image";
import Link from "next/link";

import type { Manga } from "@/lib/types";

interface PosterCardProps {
  manga: Manga;
}

export function PosterCard({ manga }: PosterCardProps) {
  const latestChapter = manga.chapters[manga.chapters.length - 1];

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="group block overflow-hidden rounded-[26px] border border-white/8 bg-white/[0.03] p-3 transition duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:bg-white/[0.05]"
    >
      <div className="poster-shadow relative aspect-[3/4] overflow-hidden rounded-[22px]">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 18vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
          <span>{manga.universe}</span>
          <span className="h-1 w-1 rounded-full bg-rose-500" />
          <span>{manga.status}</span>
        </div>
        <div>
          <h3 className="section-title text-xl text-white">{manga.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-300">{manga.tagline}</p>
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-zinc-400">
          <span>{latestChapter.title}</span>
          <span>{manga.updatedLabel}</span>
        </div>
      </div>
    </Link>
  );
}
