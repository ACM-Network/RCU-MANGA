import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterReaderClient } from "@/components/reader/chapter-reader-client";
import { getChapter } from "@/lib/content";

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapterId } = await params;
  const result = getChapter(slug, chapterId);

  if (!result) {
    return {
      title: "Chapter Not Found | RCPU",
    };
  }

  return {
    title: `${result.manga.title} - ${result.chapter.title} | RCPU`,
    description: result.chapter.synopsis,
    openGraph: {
      title: `${result.manga.title} - ${result.chapter.title} | RCPU`,
      description: result.chapter.synopsis,
      images: [{ url: result.manga.heroImage }],
    },
  };
}

export async function generateStaticParams() {
  const { mangaLibrary } = await import("@/lib/content");
  return mangaLibrary.flatMap((manga) =>
    manga.chapters.map((chapter) => ({
      slug: manga.slug,
      chapterId: chapter.id,
    })),
  );
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterId } = await params;
  const result = getChapter(slug, chapterId);

  if (!result) notFound();

  return (
    <ChapterReaderClient
      manga={result.manga}
      chapter={result.chapter}
      previous={result.previous}
      next={result.next}
    />
  );
}
