"use client";

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
    bookmarks: Array.isArray(rawProfile?.bookmarks) ? rawProfile.bookmarks : fallback.bookmarks,
    likedChapters: Array.isArray(rawProfile?.likedChapters)
      ? rawProfile.likedChapters
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

      if (!left) return [key, right];
      if (!right) return [key, left];

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

function resolveProfileKey(identity: ReaderIdentity | null) {
  return identity ? getUserCacheKey(identity.id) : guestLibraryStorageKey;
}

export function subscribeToUserLibrary(
  identity: ReaderIdentity | null,
  callback: (profile: UserLibraryProfile) => void,
  onError?: (message: string) => void,
) {
  void onError;

  const baseProfile = createProfileFromIdentity(identity);
  const readProfile = () => {
    if (!identity) {
      return normalizeProfile(loadGuestLibraryProfile(), baseProfile);
    }

    return loadUserLibraryCache(identity);
  };

  callback(readProfile());

  if (typeof window === "undefined") {
    return () => undefined;
  }

  const watchedKey = resolveProfileKey(identity);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === watchedKey) {
      callback(readProfile());
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export async function ensureUserProfile(identity: ReaderIdentity) {
  if (!identity?.id || identity.id === "guest") {
    return;
  }

  const cachedProfile = loadUserLibraryCache(identity);
  cacheProfile(
    normalizeProfile(
      {
        ...cachedProfile,
        id: identity.id,
        name: identity.name ?? cachedProfile.name,
        email: identity.email ?? cachedProfile.email,
        photoURL: identity.photoURL ?? cachedProfile.photoURL,
        updatedAt: nowIso(),
      },
      createProfileFromIdentity(identity),
    ),
  );
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
}

export async function persistBookmarks(profile: UserLibraryProfile) {
  cacheProfile({
    ...profile,
    updatedAt: nowIso(),
  });
}

export async function persistLikedChapters(profile: UserLibraryProfile) {
  cacheProfile({
    ...profile,
    updatedAt: nowIso(),
  });
}

export async function persistReadingProgress(profile: UserLibraryProfile, entry: ReadingHistoryEntry) {
  cacheProfile({
    ...profile,
    readingHistory: {
      ...profile.readingHistory,
      [entry.mangaSlug]: entry,
    },
    updatedAt: nowIso(),
  });
}

export async function clearPersistedReadingHistory(profile: UserLibraryProfile) {
  cacheProfile({
    ...profile,
    readingHistory: {},
    updatedAt: nowIso(),
  });
}

export async function incrementChapterView(chapterId: string, viewerId: string) {
  if (!chapterId || !viewerId) {
    return;
  }

  const viewStorageKey = `${chapterViewPrefix}:${viewerId}:${chapterId}`;

  if (safeReadSessionStorage(viewStorageKey) === "1") {
    return;
  }

  safeWriteSessionStorage(viewStorageKey, "1");
}

export async function incrementChapterLikeCount(_chapterId: string, _delta: 1 | -1) {
  void _chapterId;
  void _delta;
  return;
}
