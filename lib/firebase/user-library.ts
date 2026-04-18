"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { UserLibraryProfile } from "@/lib/types";

const storageKey = "rcpu-user-library";

export const emptyLibraryProfile: UserLibraryProfile = {
  id: "guest",
  name: "Guest Reader",
  email: "guest@local",
  bookmarks: [],
  readingHistory: {},
  likedChapters: [],
};

export function readLocalLibraryProfile() {
  if (typeof window === "undefined") return emptyLibraryProfile;
  const raw = window.localStorage.getItem(storageKey);
  return raw ? ({ ...emptyLibraryProfile, ...JSON.parse(raw) } as UserLibraryProfile) : emptyLibraryProfile;
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
      const data = snapshot.data();
      callback({
        ...emptyLibraryProfile,
        id: userId,
        name: data?.name ?? "RCPU Reader",
        email: data?.email ?? "",
        bookmarks: data?.bookmarks ?? [],
        readingHistory: data?.readingHistory ?? {},
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
  if (profile.id !== "guest" && isFirebaseConfigured && db) {
    await setDoc(
      doc(db, "users", profile.id),
      {
        name: profile.name,
        email: profile.email,
        bookmarks: profile.bookmarks,
        readingHistory: profile.readingHistory,
        likedChapters: profile.likedChapters,
      },
      { merge: true },
    );
    return;
  }

  writeLocalLibraryProfile(profile);
}
