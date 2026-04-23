"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { ReadingHistoryEntry, UserLibraryProfile } from "@/lib/types";

const storageKey = "rcpu-user-library";

export const emptyLibraryProfile: UserLibraryProfile = {
  id: "guest",
  name: "Guest Reader",
  email: "guest@local",
  bookmarks: [],
  readingHistory: {},
  likedChapters: [],
};

function normalizeReadingHistory(readingHistory: UserLibraryProfile["readingHistory"] | undefined) {
  const entries = Object.entries(readingHistory ?? {});
  return Object.fromEntries(
    entries.map(([slug, entry]) => {
      const normalizedEntry: ReadingHistoryEntry = {
        mangaSlug: entry?.mangaSlug ?? slug,
        chapterId: entry?.chapterId ?? "",
        panelIndex: entry?.panelIndex ?? 0,
        scrollOffset: entry?.scrollOffset ?? 0,
        progress: entry?.progress ?? 0,
        updatedAt: entry?.updatedAt ?? new Date(0).toISOString(),
      };
      return [slug, normalizedEntry];
    }),
  );
}

export function readLocalLibraryProfile() {
  if (typeof window === "undefined") return emptyLibraryProfile;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return emptyLibraryProfile;
  const parsed = JSON.parse(raw) as UserLibraryProfile;
  return {
    ...emptyLibraryProfile,
    ...parsed,
    readingHistory: normalizeReadingHistory(parsed.readingHistory),
  };
}

export function writeLocalLibraryProfile(profile: UserLibraryProfile) {
  window.localStorage.setItem(storageKey, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent("rcpu-library-updated"));
}

export function subscribeToUserLibrary(
  userId: string | null,
  callback: (profile: UserLibraryProfile) => void,
) {
  if (userId && isFirebaseConfigured && db) {
    const ref = doc(db, "users", userId);
    return onSnapshot(ref, (snapshot) => {
      const data = snapshot.exists()
  ? snapshot.data()
  : {
      name: "RCPU Reader",
      email: "",
      bookmarks: [],
      readingHistory: {},
      likedChapters: [],
    };
      callback({
        ...emptyLibraryProfile,
        id: userId,
        name: data?.name ?? "RCPU Reader",
        email: data?.email ?? "",
        bookmarks: data?.bookmarks ?? [],
        readingHistory: normalizeReadingHistory(data?.readingHistory),
        likedChapters: data?.likedChapters ?? [],
      });
    });
  }

  const sync = () => callback(readLocalLibraryProfile());
  sync();
  window.addEventListener("rcpu-library-updated", sync);
  return () => window.removeEventListener("rcpu-library-updated", sync);
}

export async function persistUserLibrary(profile: UserLibraryProfile) {
  // 🔐 Logged-in user → Firestore
  if (profile.id !== "guest") {
    if (!isFirebaseConfigured || !db) {
      throw new Error("Firebase not configured properly");
    }

    await setDoc(
      doc(db, "users", profile.id),
      {
        name: profile.name,
        email: profile.email,
        bookmarks: profile.bookmarks,
        readingHistory: profile.readingHistory,
        likedChapters: profile.likedChapters,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return;
  }

  // 🧑 Guest → localStorage
  writeLocalLibraryProfile(profile);
}