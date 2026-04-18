"use client";

import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    const unsubscribe = subscribeToUserLibrary(user?.uid ?? null, (nextProfile) => {
      setProfile({
        ...nextProfile,
        id: user?.uid ?? nextProfile.id,
        name: user?.displayName ?? nextProfile.name,
        email: user?.email ?? nextProfile.email,
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.displayName, user?.email, user?.uid]);

  const updateProfile = useCallback(async (nextProfile: UserLibraryProfile) => {
    setProfile(nextProfile);
    await persistUserLibrary(nextProfile);
  }, []);

  const toggleBookmark = useCallback(async (mangaSlug: string) => {
    const isBookmarked = profile.bookmarks.includes(mangaSlug);
    const nextProfile = {
      ...profile,
      bookmarks: isBookmarked
        ? profile.bookmarks.filter((entry) => entry !== mangaSlug)
        : [...profile.bookmarks, mangaSlug],
    };
    await updateProfile(nextProfile);
  }, [profile, updateProfile]);

  const saveProgress = useCallback(async (mangaSlug: string, chapterId: string, progress: number) => {
    const currentEntry = profile.readingHistory[mangaSlug];
    if (currentEntry?.chapterId === chapterId && Math.abs((currentEntry.progress ?? 0) - progress) < 0.01) {
      return;
    }

    const nextProfile = {
      ...profile,
      readingHistory: {
        ...profile.readingHistory,
        [mangaSlug]: {
          mangaSlug,
          chapterId,
          progress,
          updatedAt: new Date().toISOString(),
        },
      },
    };
    await updateProfile(nextProfile);
  }, [profile, updateProfile]);

  const toggleLikedChapter = useCallback(async (chapterId: string) => {
    const hasLiked = profile.likedChapters.includes(chapterId);
    const nextProfile = {
      ...profile,
      likedChapters: hasLiked
        ? profile.likedChapters.filter((entry) => entry !== chapterId)
        : [...profile.likedChapters, chapterId],
    };
    await updateProfile(nextProfile);
  }, [profile, updateProfile]);

  return {
    profile,
    loading,
    toggleBookmark,
    saveProgress,
    toggleLikedChapter,
  };
}
