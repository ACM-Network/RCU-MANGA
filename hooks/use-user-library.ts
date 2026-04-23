"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
  emptyLibraryProfile,
  persistBookmarks,
  persistLikedChapters,
  persistUserLibrary,
  subscribeToUserLibrary,
} from "@/lib/firebase/user-library";
import type { ReadingHistoryEntry, UserLibraryProfile } from "@/lib/types";

export function useUserLibrary() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserLibraryProfile>(emptyLibraryProfile);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<UserLibraryProfile>(emptyLibraryProfile);

  useEffect(() => {
    const unsubscribe = subscribeToUserLibrary(user?.uid ?? null, (nextProfile) => {
      const mergedProfile = {
        ...nextProfile,
        id: user?.uid ?? nextProfile.id,
        name: user?.displayName ?? nextProfile.name ?? "RCPU Reader",
        email: user?.email ?? nextProfile.email ?? "",
      };

      profileRef.current = mergedProfile;
      setProfile(mergedProfile);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.displayName, user?.email, user?.uid]);

  const commitProfile = useCallback((nextProfile: UserLibraryProfile) => {
    profileRef.current = nextProfile;
    setProfile(nextProfile);
  }, []);

  const toggleBookmark = useCallback(
    async (mangaSlug: string) => {
      const currentProfile = profileRef.current;
      const isBookmarked = currentProfile.bookmarks.includes(mangaSlug);
      const nextProfile = {
        ...currentProfile,
        bookmarks: isBookmarked
          ? currentProfile.bookmarks.filter((entry) => entry !== mangaSlug)
          : [...currentProfile.bookmarks, mangaSlug],
      };

      commitProfile(nextProfile);
      await persistBookmarks(nextProfile);
    },
    [commitProfile],
  );

  const saveProgress = useCallback(
    async (
      mangaSlug: string,
      chapterId: string,
      panelIndex: number,
      scrollOffset: number,
      progress: number,
    ) => {
      const currentProfile = profileRef.current;
      const currentEntry = currentProfile.readingHistory[mangaSlug];

      if (
        currentEntry?.chapterId === chapterId &&
        currentEntry.panelIndex === panelIndex &&
        Math.abs((currentEntry.scrollOffset ?? 0) - scrollOffset) < 2 &&
        Math.abs((currentEntry.progress ?? 0) - progress) < 0.001
      ) {
        return;
      }

      const nextEntry: ReadingHistoryEntry = {
        mangaSlug,
        chapterId,
        panelIndex,
        scrollOffset,
        progress,
        updatedAt: new Date().toISOString(),
      };

      const nextProfile = {
        ...currentProfile,
        readingHistory: {
          ...currentProfile.readingHistory,
          [mangaSlug]: nextEntry,
        },
      };

      commitProfile(nextProfile);
      await persistUserLibrary(nextProfile);
    },
    [commitProfile],
  );

  const toggleLikedChapter = useCallback(
    async (chapterId: string) => {
      const currentProfile = profileRef.current;
      const hasLiked = currentProfile.likedChapters.includes(chapterId);
      const nextProfile = {
        ...currentProfile,
        likedChapters: hasLiked
          ? currentProfile.likedChapters.filter((entry) => entry !== chapterId)
          : [...currentProfile.likedChapters, chapterId],
      };

      commitProfile(nextProfile);
      await persistLikedChapters(nextProfile);
    },
    [commitProfile],
  );

  return {
    profile,
    loading,
    toggleBookmark,
    saveProgress,
    toggleLikedChapter,
  };
}
