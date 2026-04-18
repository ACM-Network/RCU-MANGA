"use client";

import { useEffect, useState } from "react";

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

  async function updateProfile(nextProfile: UserLibraryProfile) {
    setProfile(nextProfile);
    await persistUserLibrary(nextProfile);
  }

  async function toggleBookmark(mangaSlug: string) {
    const isBookmarked = profile.bookmarks.includes(mangaSlug);
    const nextProfile = {
      ...profile,
      bookmarks: isBookmarked
        ? profile.bookmarks.filter((entry) => entry !== mangaSlug)
        : [...profile.bookmarks, mangaSlug],
    };
    await updateProfile(nextProfile);
  }

  async function saveProgress(mangaSlug: string, chapterId: string, progress: number) {
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
  }

  async function toggleLikedChapter(chapterId: string) {
    const hasLiked = profile.likedChapters.includes(chapterId);
    const nextProfile = {
      ...profile,
      likedChapters: hasLiked
        ? profile.likedChapters.filter((entry) => entry !== chapterId)
        : [...profile.likedChapters, chapterId],
    };
    await updateProfile(nextProfile);
  }

  return {
    profile,
    loading,
    toggleBookmark,
    saveProgress,
    toggleLikedChapter,
  };
}
