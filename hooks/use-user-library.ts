"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
  emptyLibraryProfile,
  persistUserLibrary,
  subscribeToUserLibrary,
} from "@/lib/firebase/user-library";
import type { UserLibraryProfile } from "@/lib/types";

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
        name: user?.displayName ?? nextProfile.name,
        email: user?.email ?? nextProfile.email,
      };
      profileRef.current = mergedProfile;
      setProfile(mergedProfile);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.displayName, user?.email, user?.uid]);

  const updateProfile = useCallback(async (nextProfile: UserLibraryProfile) => {
    profileRef.current = nextProfile;
    setProfile(nextProfile);
    await persistUserLibrary(nextProfile);
  }, []);

  const toggleBookmark = useCallback(async (mangaSlug: string) => {
    const currentProfile = profileRef.current;
    const isBookmarked = currentProfile.bookmarks.includes(mangaSlug);
    const nextProfile = {
      ...currentProfile,
      bookmarks: isBookmarked
        ? currentProfile.bookmarks.filter((entry) => entry !== mangaSlug)
        : [...currentProfile.bookmarks, mangaSlug],
    };
    await updateProfile(nextProfile);
  }, [updateProfile]);

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
        Math.abs((currentEntry.scrollOffset ?? 0) - scrollOffset) < 24 &&
        Math.abs((currentEntry.progress ?? 0) - progress) < 0.01
      ) {
        return;
      }

      const nextProfile = {
        ...currentProfile,
        readingHistory: {
          ...currentProfile.readingHistory,
          [mangaSlug]: {
            mangaSlug,
            chapterId,
            panelIndex,
            scrollOffset,
            progress,
            updatedAt: new Date().toISOString(),
          },
        },
      };
      await updateProfile(nextProfile);
    },
    [updateProfile],
  );

  const toggleLikedChapter = useCallback(async (chapterId: string) => {
    const currentProfile = profileRef.current;
    const hasLiked = currentProfile.likedChapters.includes(chapterId);
    const nextProfile = {
      ...currentProfile,
      likedChapters: hasLiked
        ? currentProfile.likedChapters.filter((entry) => entry !== chapterId)
        : [...currentProfile.likedChapters, chapterId],
    };
    await updateProfile(nextProfile);
  }, [updateProfile]);

  return {
    profile,
    loading,
    toggleBookmark,
    saveProgress,
    toggleLikedChapter,
  };
}
