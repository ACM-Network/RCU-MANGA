"use client";

import {
  deleteField,
  doc,
  increment,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { ReadingHistoryEntry, UserLibraryProfile } from "@/lib/types";

export type ReaderIdentity = {
  id: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

const guestLibraryStorageKey = "realm-cinematic:guest-library";
const chapterViewPrefix = "realm-cinematic:chapter-view";

export const emptyLibraryProfile: UserLibraryProfile = {
  id: "guest",
  name: "Guest Reader",
  email: "",
  photoURL: "",
  bookmarks: [],
  readingHistory: {},
  likedChapters: [],
};

function nowIso() {
  return new Date().toISOString();
}

function getUserCacheKey(userId: string) {
  return `realm-cinematic:user-library:${userId}`;
}

function safeReadStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeReadSessionStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteStorage(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function safeWriteSessionStorage(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    return;
  }
}

function safeRemoveStorage(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

function normalizeReadingHistory(
  readingHistory: Record<string, Partial<ReadingHistoryEntry>> | undefined,
) {
  return Object.fromEntries(
    Object.entries(readingHistory ?? {}).map(([mangaSlug, entry]) => [
      mangaSlug,
      {
        mangaSlug,
        chapterId: entry.chapterId ?? "",
        pageIndex: entry.pageIndex ?? 0,
        progress: entry.progress ?? 0,
        updatedAt: entry.updatedAt ?? new Date(0).toISOString(),
      } satisfies ReadingHistoryEntry,
    ]),
  );
}

function normalizeProfile(
  rawProfile: Partial<UserLibraryProfile> | null | undefined,
  fallback: UserLibraryProfile,
): UserLibraryProfile {
  return {
    ...fallback,
    id: rawProfile?.id ?? fallback.id,
    name: rawProfile?.name ?? fallback.name,
    email: rawProfile?.email ?? fallback.email,
    photoURL: rawProfile?.photoURL ?? fallback.photoURL ?? "",
    bookmarks: Array.isArray(rawProfile?.bookmarks) ? rawProfile?.bookmarks : fallback.bookmarks,
    likedChapters: Array.isArray(rawProfile?.likedChapters)
      ? rawProfile?.likedChapters
      : fallback.likedChapters,
    readingHistory: normalizeReadingHistory(rawProfile?.readingHistory),
    updatedAt: rawProfile?.updatedAt ?? fallback.updatedAt ?? nowIso(),
  };
}

function mergeReadingHistory(
  first: Record<string, ReadingHistoryEntry>,
  second: Record<string, ReadingHistoryEntry>,
) {
  const keys = new Set([...Object.keys(first), ...Object.keys(second)]);

  return Object.fromEntries(
    Array.from(keys).map((key) => {
      const left = first[key];
      const right = second[key];

      if (!left) {
        return [key, right];
      }

      if (!right) {
        return [key, left];
      }

      return [key, left.updatedAt >= right.updatedAt ? left : right];
    }),
  ) as Record<string, ReadingHistoryEntry>;
}

function createProfileFromIdentity(identity: ReaderIdentity | null): UserLibraryProfile {
  if (!identity) {
    return {
      ...loadGuestLibraryProfile(),
      id: "guest",
      name: "Guest Reader",
      email: "",
      photoURL: "",
    };
  }

  return {
    ...emptyLibraryProfile,
    id: identity.id,
    name: identity.name?.trim() || "Cinematic Reader",
    email: identity.email?.trim() || "",
    photoURL: identity.photoURL?.trim() || "",
  };
}

function serializeProfile(profile: UserLibraryProfile) {
  return JSON.stringify({
    ...profile,
    updatedAt: profile.updatedAt ?? nowIso(),
  });
}

export function loadGuestLibraryProfile() {
  const raw = safeReadStorage(guestLibraryStorageKey);

  if (!raw) {
    return emptyLibraryProfile;
  }

  try {
    return normalizeProfile(JSON.parse(raw) as Partial<UserLibraryProfile>, emptyLibraryProfile);
  } catch {
    return emptyLibraryProfile;
  }
}

function loadUserLibraryCache(identity: ReaderIdentity) {
  const raw = safeReadStorage(getUserCacheKey(identity.id));

  if (!raw) {
    return createProfileFromIdentity(identity);
  }

  try {
    return normalizeProfile(JSON.parse(raw) as Partial<UserLibraryProfile>, createProfileFromIdentity(identity));
  } catch {
    return createProfileFromIdentity(identity);
  }
}

function cacheProfile(profile: UserLibraryProfile) {
  if (profile.id === "guest") {
    safeWriteStorage(guestLibraryStorageKey, serializeProfile(profile));
    return;
  }

  safeWriteStorage(getUserCacheKey(profile.id), serializeProfile(profile));
}

function persistGuestProfile(profile: UserLibraryProfile) {
  const guestProfile = normalizeProfile(profile, emptyLibraryProfile);
  cacheProfile({
    ...guestProfile,
    id: "guest",
    name: "Guest Reader",
    email: "",
    photoURL: "",
  });
}

function createUserDoc(profile: UserLibraryProfile) {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    photoURL: profile.photoURL ?? "",
    bookmarks: profile.bookmarks,
    likedChapters: profile.likedChapters,
    readingHistory: profile.readingHistory,
    updatedAt: profile.updatedAt ?? nowIso(),
  };
}

function requireFirestore() {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase Firestore is not configured.");
  }

  return db;
}

export function subscribeToUserLibrary(
  identity: ReaderIdentity | null,
  callback: (profile: UserLibraryProfile) => void,
  onError?: (message: string) => void,
) {
  const baseProfile = createProfileFromIdentity(identity);

  if (!identity) {
    const guestProfile = loadGuestLibraryProfile();
    callback(normalizeProfile(guestProfile, baseProfile));

    if (typeof window === "undefined") {
      return () => undefined;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === guestLibraryStorageKey) {
        callback(normalizeProfile(loadGuestLibraryProfile(), baseProfile));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }

  const cachedProfile = loadUserLibraryCache(identity);
  callback(cachedProfile);

  if (!isFirebaseConfigured || !db) {
    return () => undefined;
  }

  let unsubscribe: Unsubscribe = () => undefined;

  try {
    unsubscribe = onSnapshot(
      doc(db, "users", identity.id),
      (snapshot) => {
        const nextProfile = snapshot.exists()
          ? normalizeProfile(snapshot.data() as Partial<UserLibraryProfile>, baseProfile)
          : cachedProfile;

        cacheProfile(nextProfile);
        callback(nextProfile);
      },
      () => {
        callback(cachedProfile);
        onError?.("Cloud sync is temporarily unavailable. Your local reading state is still safe.");
      },
    );
  } catch {
    callback(cachedProfile);
    onError?.("Cloud sync could not start. Falling back to local reader state.");
  }

  return unsubscribe;
}

export async function ensureUserProfile(identity: ReaderIdentity) {
  if (!identity?.id || identity.id === "guest") {
    return;
  }

  const firestore = requireFirestore();
  const cachedProfile = loadUserLibraryCache(identity);
  const nextProfile = normalizeProfile(
    {
      ...cachedProfile,
      id: identity.id,
      name: identity.name ?? cachedProfile.name,
      email: identity.email ?? cachedProfile.email,
      photoURL: identity.photoURL ?? cachedProfile.photoURL,
      updatedAt: nowIso(),
    },
    createProfileFromIdentity(identity),
  );

  cacheProfile(nextProfile);
  await setDoc(doc(firestore, "users", identity.id), createUserDoc(nextProfile), { merge: true });
}

export async function mergeGuestProfileIntoUser(identity: ReaderIdentity) {
  if (!identity?.id || identity.id === "guest") {
    return;
  }

  const guestProfile = loadGuestLibraryProfile();

  if (
    !guestProfile.bookmarks.length &&
    !guestProfile.likedChapters.length &&
    !Object.keys(guestProfile.readingHistory).length
  ) {
    return;
  }

  const currentProfile = loadUserLibraryCache(identity);

  const mergedProfile = normalizeProfile(
    {
      ...currentProfile,
      bookmarks: Array.from(new Set([...currentProfile.bookmarks, ...guestProfile.bookmarks])),
      likedChapters: Array.from(
        new Set([...currentProfile.likedChapters, ...guestProfile.likedChapters]),
      ),
      readingHistory: mergeReadingHistory(guestProfile.readingHistory, currentProfile.readingHistory),
      updatedAt: nowIso(),
    },
    createProfileFromIdentity(identity),
  );

  cacheProfile(mergedProfile);
  safeRemoveStorage(guestLibraryStorageKey);

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const firestore = requireFirestore();
  await setDoc(doc(firestore, "users", identity.id), createUserDoc(mergedProfile), { merge: true });
}

export async function persistBookmarks(profile: UserLibraryProfile) {
  const nextProfile = {
    ...profile,
    updatedAt: nowIso(),
  };

  cacheProfile(nextProfile);

  if (profile.id === "guest" || !isFirebaseConfigured || !db) {
    persistGuestProfile(nextProfile);
    return;
  }

  await setDoc(
    doc(requireFirestore(), "users", profile.id),
    {
      bookmarks: nextProfile.bookmarks,
      updatedAt: nextProfile.updatedAt,
    },
    { merge: true },
  );
}

export async function persistLikedChapters(profile: UserLibraryProfile) {
  const nextProfile = {
    ...profile,
    updatedAt: nowIso(),
  };

  cacheProfile(nextProfile);

  if (profile.id === "guest" || !isFirebaseConfigured || !db) {
    persistGuestProfile(nextProfile);
    return;
  }

  await setDoc(
    doc(requireFirestore(), "users", profile.id),
    {
      likedChapters: nextProfile.likedChapters,
      updatedAt: nextProfile.updatedAt,
    },
    { merge: true },
  );
}

export async function persistReadingProgress(profile: UserLibraryProfile, entry: ReadingHistoryEntry) {
  const nextProfile: UserLibraryProfile = {
    ...profile,
    readingHistory: {
      ...profile.readingHistory,
      [entry.mangaSlug]: entry,
    },
    updatedAt: nowIso(),
  };

  cacheProfile(nextProfile);

  if (profile.id === "guest" || !isFirebaseConfigured || !db) {
    persistGuestProfile(nextProfile);
    return;
  }

  await setDoc(
    doc(requireFirestore(), "users", profile.id),
    {
      readingHistory: {
        [entry.mangaSlug]: entry,
      },
      updatedAt: nextProfile.updatedAt,
    },
    { merge: true },
  );
}

export async function clearPersistedReadingHistory(profile: UserLibraryProfile) {
  const nextProfile: UserLibraryProfile = {
    ...profile,
    readingHistory: {},
    updatedAt: nowIso(),
  };

  cacheProfile(nextProfile);

  if (profile.id === "guest" || !isFirebaseConfigured || !db) {
    persistGuestProfile(nextProfile);
    return;
  }

  await setDoc(
    doc(requireFirestore(), "users", profile.id),
    {
      readingHistory: deleteField(),
      updatedAt: nextProfile.updatedAt,
    },
    { merge: true },
  );
}

export async function incrementChapterView(chapterId: string, viewerId: string) {
  if (!chapterId || !viewerId || !isFirebaseConfigured || !db) {
    return;
  }

  const viewStorageKey = `${chapterViewPrefix}:${viewerId}:${chapterId}`;

  if (safeReadSessionStorage(viewStorageKey) === "1") {
    return;
  }

  safeWriteSessionStorage(viewStorageKey, "1");

  await setDoc(
    doc(requireFirestore(), "chapters", chapterId),
    {
      chapterId,
      views: increment(1),
      updatedAt: nowIso(),
    },
    { merge: true },
  );
}

export async function incrementChapterLikeCount(chapterId: string, delta: 1 | -1) {
  if (!chapterId || !isFirebaseConfigured || !db) {
    return;
  }

  await setDoc(
    doc(requireFirestore(), "chapters", chapterId),
    {
      chapterId,
      likes: increment(delta),
      updatedAt: nowIso(),
    },
    { merge: true },
  );
}
