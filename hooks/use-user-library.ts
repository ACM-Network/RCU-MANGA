"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
  emptyLibraryProfile,
  ensureUserProfile,
  incrementChapterLikeCount,
  incrementChapterView,
  mergeGuestProfileIntoUser,
  persistBookmarks,
  persistLikedChapters,
  persistReadingProgress,
  subscribeToUserLibrary,
  type ReaderIdentity,
} from "@/lib/firebase/user-library";
import type { ReadingHistoryEntry, UserLibraryProfile } from "@/lib/types";

function createIdentity(
  id: string | null | undefined,
  name: string | null | undefined,
  email: string | null | undefined,
  photoURL: string | null | undefined,
): ReaderIdentity | null {
  if (!id) {
    return null;
  }

  return {
    id,
    name,
    email,
    photoURL,
  };
}

export function useUserLibrary() {
  const { user } = useAuth();
  const identity = useMemo(
    () => createIdentity(user?.uid, user?.displayName, user?.email, user?.photoURL),
    [user?.displayName, user?.email, user?.photoURL, user?.uid],
  );
  const viewerId = identity?.id ?? null;

  const [profile, setProfile] = useState<UserLibraryProfile>(emptyLibraryProfile);
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const profileRef = useRef<UserLibraryProfile>(emptyLibraryProfile);

  useEffect(() => {
    if (identity) {
      void mergeGuestProfileIntoUser(identity).catch(() => undefined);
      void ensureUserProfile(identity).catch(() => undefined);
    }

    const unsubscribe = subscribeToUserLibrary(
      identity,
      (nextProfile) => {
        const resolvedProfile = {
          ...nextProfile,
          id: identity?.id ?? "guest",
          name: identity?.name?.trim() || nextProfile.name || "Guest Reader",
          email: identity?.email?.trim() || nextProfile.email || "",
          photoURL: identity?.photoURL?.trim() || nextProfile.photoURL || "",
        };

        profileRef.current = resolvedProfile;
        setProfile(resolvedProfile);
        setSyncMessage(null);
        setLoading(false);
      },
      (message) => {
        setSyncMessage(message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [identity]);

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
    async (mangaSlug: string, chapterId: string, pageIndex: number, progress: number) => {
      const currentProfile = profileRef.current;
      const currentEntry = currentProfile.readingHistory[mangaSlug];

      if (
        currentEntry?.chapterId === chapterId &&
        currentEntry.pageIndex === pageIndex &&
        Math.abs((currentEntry.progress ?? 0) - progress) < 0.001
      ) {
        return;
      }

      const nextEntry: ReadingHistoryEntry = {
        mangaSlug,
        chapterId,
        pageIndex,
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
      await persistReadingProgress(nextProfile, nextEntry);
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
      await Promise.all([
        persistLikedChapters(nextProfile),
        incrementChapterLikeCount(chapterId, hasLiked ? -1 : 1),
      ]);

      return !hasLiked;
    },
    [commitProfile],
  );

  const registerChapterView = useCallback(async (chapterId: string) => {
    if (!viewerId) {
      return;
    }

    await incrementChapterView(chapterId, viewerId);
  }, [viewerId]);

  return {
    profile,
    loading,
    syncMessage,
    isAuthenticated: Boolean(viewerId),
    toggleBookmark,
    saveProgress,
    toggleLikedChapter,
    registerChapterView,
  };
}
