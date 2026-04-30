"use client";

import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface LibraryGridItem {
  slug: string;
  title: string;
  coverImage: string;
  universe: string;
  status: string;
  latestChapterTitle: string;
  badge: string;
}

interface LibraryGridProps {
  items: LibraryGridItem[];
  loading?: boolean;
}

export function LibraryGrid({ items, loading = false }: LibraryGridProps) {
  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-[26px]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-amber-100/80">Library</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Saved Manga</h2>
        </div>
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{items.length} titles</p>
      </div>

      {items.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/manga/${item.slug}`}
              className="card-hover group overflow-hidden rounded-[26px] border border-white/10 bg-[#111318]/82 p-2.5"
            >
              <div className="poster-shadow relative aspect-[3/4] overflow-hidden rounded-[21px]">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/12 to-transparent opacity-90 transition duration-300 group-hover:opacity-100" />
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-100 backdrop-blur-md">
                  {item.badge}
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-amber-100/80">
                    {item.universe}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-xs text-stone-300">
                    {item.latestChapterTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-1 pt-3 text-[10px] uppercase tracking-[0.22em] text-stone-500">
                <span>{item.status}</span>
                <span>Open</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="panel rounded-[30px] p-6">
          <p className="text-sm leading-7 text-stone-300">
            No saved titles yet. Bookmark a manga or like a chapter to build your shelf.
          </p>
          <div className="mt-5">
            <ButtonLink href="/library" variant="secondary">
              Browse Manga
            </ButtonLink>
          </div>
        </div>
      )}
    </section>
  );
}
