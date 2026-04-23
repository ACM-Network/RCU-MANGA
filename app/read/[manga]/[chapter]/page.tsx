import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterReaderClient } from "@/components/reader/chapter-reader-client";
import { getChapter } from "@/lib/content";

interface ReadPageProps {
  params: Promise<{ manga: string; chapter: string }>;
}

export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const { manga, chapter } = await params;
  const result = getChapter(manga, chapter);

  if (!result) {
    return {
      title: "Chapter Not Found | Realm Cinematic",
    };
  }

  return {
    title: `${result.manga.title} - ${result.chapter.title} | Realm Cinematic`,
    description: result.chapter.synopsis,
    openGraph: {
      title: `${result.manga.title} - ${result.chapter.title} | Realm Cinematic`,
      description: result.chapter.synopsis,
      images: [{ url: result.manga.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const { mangaLibrary } = await import("@/lib/content");
  return mangaLibrary.flatMap((manga) =>
    manga.chapters.map((chapter) => ({
      manga: manga.slug,
      chapter: chapter.id,
    })),
  );
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { manga, chapter } = await params;
  const result = getChapter(manga, chapter);

  if (!result) notFound();

  return (
    <ChapterReaderClient
      key={result.chapter.id}
      manga={result.manga}
      chapter={result.chapter}
      previous={result.previous}
      next={result.next}
    />
  );
}
