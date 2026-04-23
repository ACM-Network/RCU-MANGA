"use client";

import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { ReadingHistoryEntry, UserLibraryProfile } from "@/lib/types";

export const emptyLibraryProfile: UserLibraryProfile = {
  id: "guest",
  name: "Guest Reader",
  email: "",
  bookmarks: [],
  readingHistory: {},
  likedChapters: [],
};

function normalizeReadingEntry(mangaSlug: string, entry: Partial<ReadingHistoryEntry> | undefined) {
  return {
    mangaSlug: entry?.mangaSlug ?? mangaSlug,
    chapterId: entry?.chapterId ?? "",
    panelIndex: entry?.panelIndex ?? 0,
    scrollOffset: entry?.scrollOffset ?? 0,
    progress: entry?.progress ?? 0,
    updatedAt: entry?.updatedAt ?? new Date(0).toISOString(),
  } satisfies ReadingHistoryEntry;
}

function createUserProfileDoc(profile: Pick<UserLibraryProfile, "id" | "name" | "email">) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    updatedAt: new Date().toISOString(),
  };
}

function requireFirestore() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured.");
  }

  return db;
}

export function subscribeToUserLibrary(
  userId: string | null,
  callback: (profile: UserLibraryProfile) => void,
) {
  if (!userId || !isFirebaseConfigured || !db) {
    callback(emptyLibraryProfile);
    return () => undefined;
  }

  const nextProfile: UserLibraryProfile = {
    ...emptyLibraryProfile,
    id: userId,
  };

  const emit = () => callback({ ...nextProfile });

  const unsubscribeLibrary = onSnapshot(doc(db, "users", userId, "library", "state"), (snapshot) => {
    nextProfile.bookmarks = snapshot.data()?.bookmarks ?? [];
    emit();
  });

  const unsubscribeLikes = onSnapshot(doc(db, "users", userId, "likes", "state"), (snapshot) => {
    nextProfile.likedChapters = snapshot.data()?.chapterIds ?? [];
    emit();
  });

  const unsubscribeProgress = onSnapshot(
    query(collection(db, "users", userId, "progress")),
    (snapshot) => {
      nextProfile.readingHistory = Object.fromEntries(
        snapshot.docs.map((entryDoc) => [
          entryDoc.id,
          normalizeReadingEntry(entryDoc.id, entryDoc.data() as Partial<ReadingHistoryEntry>),
        ]),
      );
      emit();
    },
  );

  return () => {
    unsubscribeLibrary();
    unsubscribeLikes();
    unsubscribeProgress();
  };
}

export async function persistBookmarks(
  profile: Pick<UserLibraryProfile, "id" | "name" | "email" | "bookmarks">,
) {
  if (profile.id === "guest") return;

  const firestore = requireFirestore();

  await Promise.all([
    setDoc(doc(firestore, "users", profile.id), createUserProfileDoc(profile), { merge: true }),
    setDoc(
      doc(firestore, "users", profile.id, "library", "state"),
      {
        bookmarks: profile.bookmarks,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ),
  ]);
}

export async function persistLikedChapters(
  profile: Pick<UserLibraryProfile, "id" | "name" | "email" | "likedChapters">,
) {
  if (profile.id === "guest") return;

  const firestore = requireFirestore();

  await Promise.all([
    setDoc(doc(firestore, "users", profile.id), createUserProfileDoc(profile), { merge: true }),
    setDoc(
      doc(firestore, "users", profile.id, "likes", "state"),
      {
        chapterIds: profile.likedChapters,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    ),
  ]);
}

export async function persistReadingProgress(
  profile: Pick<UserLibraryProfile, "id" | "name" | "email">,
  entry: ReadingHistoryEntry,
) {
  if (profile.id === "guest") return;

  const firestore = requireFirestore();

  await Promise.all([
    setDoc(doc(firestore, "users", profile.id), createUserProfileDoc(profile), { merge: true }),
    setDoc(doc(firestore, "users", profile.id, "progress", entry.mangaSlug), entry, { merge: true }),
  ]);
}

export async function persistUserLibrary(profile: UserLibraryProfile) {
  if (profile.id === "guest") return;

  const firestore = requireFirestore();
  const batch = writeBatch(firestore);
  const updatedAt = new Date().toISOString();

  batch.set(
    doc(firestore, "users", profile.id),
    {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      updatedAt,
    },
    { merge: true },
  );

  batch.set(
    doc(firestore, "users", profile.id, "library", "state"),
    {
      bookmarks: profile.bookmarks,
      updatedAt,
    },
    { merge: true },
  );

  batch.set(
    doc(firestore, "users", profile.id, "likes", "state"),
    {
      chapterIds: profile.likedChapters,
      updatedAt,
    },
    { merge: true },
  );

  Object.values(profile.readingHistory).forEach((entry) => {
    batch.set(doc(firestore, "users", profile.id, "progress", entry.mangaSlug), entry, {
      merge: true,
    });
  });

  await batch.commit();
}
