"use client";

import { useMemo, useState } from "react";

import {
  ContinueReading,
  type ContinueReadingItem,
} from "@/components/account/continue-reading";
import { LibraryGrid, type LibraryGridItem } from "@/components/account/library-grid";
import { ProfileCard } from "@/components/account/profile-card";
import { StatsCard, type AccountStats } from "@/components/account/stats-card";
import { useAuth } from "@/hooks/use-auth";
import { useUserLibrary } from "@/hooks/use-user-library";
import { mangaLibrary } from "@/lib/content";
import type { Manga, ReadingHistoryEntry } from "@/lib/types";
import { sortReadingHistory } from "@/lib/utils";

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

function findMangaByChapterId(chapterId: string) {
  return mangaLibrary.find((manga) =>
    manga.chapters.some((chapter) => chapter.id === chapterId),
  );
}

function toContinueReadingItem(
  entry: ReadingHistoryEntry,
): ContinueReadingItem | null {
  const manga = mangaLibrary.find((item) => item.slug === entry.mangaSlug);
  const chapter = manga?.chapters.find((candidate) => candidate.id === entry.chapterId);

  if (!manga || !chapter) {
    return null;
  }

  const totalPages = Math.max(chapter.pages.length, 1);
  const fallbackProgress = (entry.pageIndex + 1) / totalPages;

  return {
    mangaSlug: manga.slug,
    mangaTitle: manga.title,
    coverImage: manga.coverImage,
    universe: manga.universe,
    chapterId: chapter.id,
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
    pageIndex: Math.max(0, Math.min(totalPages - 1, entry.pageIndex)),
    totalPages,
    progress: clampProgress(entry.progress || fallbackProgress),
    updatedAt: entry.updatedAt,
  };
}

function toLibraryItem(manga: Manga, badge: string): LibraryGridItem {
  const latestChapter = manga.chapters[manga.chapters.length - 1];

  return {
    slug: manga.slug,
    title: manga.title,
    coverImage: manga.coverImage,
    universe: manga.universe,
    status: manga.status,
    latestChapterTitle: latestChapter?.title ?? "No chapters yet",
    badge,
  };
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    profile,
    loading: libraryLoading,
    syncMessage,
    isAuthenticated,
    clearReadingHistory,
  } = useUserLibrary();
  const [clearingHistory, setClearingHistory] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loading = authLoading || libraryLoading;

  const continueReadingItems = useMemo(
    () =>
      sortReadingHistory(Object.values(profile.readingHistory))
        .map(toContinueReadingItem)
        .filter((item): item is ContinueReadingItem => Boolean(item)),
    [profile.readingHistory],
  );

  const libraryItems = useMemo(() => {
    const bookmarkedSlugs = new Set(profile.bookmarks);
    const likedMangaSlugs = new Set(
      profile.likedChapters
        .map((chapterId) => findMangaByChapterId(chapterId)?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    );

    const savedSlugs = Array.from(new Set([...bookmarkedSlugs, ...likedMangaSlugs]));

    return savedSlugs
      .map((slug) => {
        const manga = mangaLibrary.find((item) => item.slug === slug);

        if (!manga) {
          return null;
        }

        const isBookmarked = bookmarkedSlugs.has(slug);
        const isLiked = likedMangaSlugs.has(slug);
        const badge = isBookmarked && isLiked ? "Saved" : isBookmarked ? "Bookmark" : "Liked";

        return toLibraryItem(manga, badge);
      })
      .filter((item): item is LibraryGridItem => Boolean(item));
  }, [profile.bookmarks, profile.likedChapters]);

  const stats = useMemo<AccountStats>(() => {
    const lastRead = continueReadingItems[0] ?? null;

    return {
      totalChaptersRead: continueReadingItems.length,
      bookmarkedManga: profile.bookmarks.length,
      likedChapters: profile.likedChapters.length,
      lastReadManga: lastRead
        ? {
            title: lastRead.mangaTitle,
            chapterTitle: `Chapter ${lastRead.chapterNumber}: ${lastRead.chapterTitle}`,
            updatedAt: lastRead.updatedAt,
          }
        : null,
    };
  }, [continueReadingItems, profile.bookmarks.length, profile.likedChapters.length]);

  async function handleClearHistory() {
    if (!continueReadingItems.length || clearingHistory) {
      return;
    }

    setClearingHistory(true);
    setActionMessage(null);

    try {
      await clearReadingHistory();
      setActionMessage("Reading history cleared.");
    } catch {
      setActionMessage("Reading history could not be cleared right now.");
    } finally {
      setClearingHistory(false);
    }
  }

  const profileName = user?.displayName || profile.name;
  const profileEmail = user?.email || profile.email;
  const profilePhoto = user?.photoURL || profile.photoURL;

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-100/80">Account</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
            Reader Profile
          </h1>
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300">
          {isAuthenticated ? "Cloud Profile" : "Local Profile"}
        </p>
      </header>

      {syncMessage ? (
        <div className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
          {syncMessage}
        </div>
      ) : null}

      {actionMessage ? (
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-stone-200">
          {actionMessage}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <ProfileCard
          name={profileName}
          email={profileEmail}
          photoURL={profilePhoto}
          isAuthenticated={isAuthenticated}
          loading={loading}
          syncMessage={syncMessage}
          onLogout={signOut}
        />
        <StatsCard stats={stats} loading={loading} />
      </section>

      <ContinueReading
        items={continueReadingItems}
        loading={loading}
        clearing={clearingHistory}
        onClearHistory={handleClearHistory}
      />

      <LibraryGrid items={libraryItems} loading={loading} />
    </div>
  );
}
