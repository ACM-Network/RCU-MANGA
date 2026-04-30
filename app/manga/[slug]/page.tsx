import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MangaActions } from "@/components/manga/manga-actions";
import { getMangaBySlug } from "@/lib/content";
import { formatChapterNumber } from "@/lib/utils";

interface MangaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MangaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manga = getMangaBySlug(slug);

  if (!manga) {
    return {
      title: "Manga Not Found | Realm Cinematic",
    };
  }

  return {
    title: `${manga.title} | Realm Cinematic`,
    description: manga.description,
    openGraph: {
      title: `${manga.title} | Realm Cinematic`,
      description: manga.description,
      images: [{ url: manga.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const { mangaLibrary } = await import("@/lib/content");
  return mangaLibrary.map((manga) => ({ slug: manga.slug }));
}

export default async function MangaDetailPage({ params }: MangaDetailPageProps) {
  const { slug } = await params;
  const manga = getMangaBySlug(slug);

  if (!manga) notFound();

  const firstChapter = manga.chapters[0];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10">
          <Image
            src={manga.coverImage}
            alt={manga.title}
            width={900}
            height={1200}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div className="panel rounded-[32px] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">{manga.universe}</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{manga.title}</h1>
          <p className="mt-4 text-lg text-stone-200">{manga.tagline}</p>
          <p className="mt-5 text-base leading-8 text-stone-300">{manga.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {manga.genre.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-200"
              >
                {tag}
              </span>
            ))}
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-200">
              {manga.status}
            </span>
          </div>

          {firstChapter ? (
            <MangaActions mangaSlug={manga.slug} firstChapterId={firstChapter.id} />
          ) : (
            <p className="mt-8 rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-stone-300">
              Chapters are not available for this series yet.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Chapter List</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Story Run</h2>
        </div>
        <div className="space-y-4">
          {manga.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/read/${manga.slug}/${chapter.id}`}
              className="block rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    {formatChapterNumber(chapter.number)}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{chapter.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">{chapter.synopsis}</p>
                </div>
                <p className="text-sm text-stone-400">{chapter.createdAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
