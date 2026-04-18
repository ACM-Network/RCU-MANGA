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
      className="card-hover group block overflow-hidden rounded-[26px] border border-white/8 bg-white/[0.03] p-3"
    >
      <div className="poster-shadow relative aspect-[3/4] overflow-hidden rounded-[22px]">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 18vw"
          className="object-cover transition duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-75 transition group-hover:opacity-90" />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-200 backdrop-blur-md">
          <span>{manga.universe}</span>
          <span>{manga.status}</span>
        </div>
      </div>
      <div className="space-y-3 px-1 pb-1 pt-4">
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
