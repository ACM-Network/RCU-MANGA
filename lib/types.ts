export type UniverseKey = "RCPU" | "Strings Universe";
export type MangaStatus = "Ongoing" | "Completed";

export interface Chapter {
  id: string;
  slug: string;
  number: number;
  title: string;
  createdAt: string;
  synopsis: string;
  images: string[];
}

export interface Manga {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  heroImage: string;
  genre: string[];
  universe: UniverseKey;
  status: MangaStatus;
  accent: string;
  trendingScore: number;
  updatedLabel: string;
  chapters: Chapter[];
}

export interface UserLibraryProfile {
  id: string;
  name: string;
  email: string;
  bookmarks: string[];
  readingHistory: Record<string, ReadingHistoryEntry>;
  likedChapters: string[];
}

export interface ReadingHistoryEntry {
  mangaSlug: string;
  chapterId: string;
  panelIndex: number;
  scrollOffset: number;
  progress: number;
  updatedAt: string;
}

export interface CommentRecord {
  id: string;
  userId: string;
  userName: string;
  chapterId: string;
  text: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  stories: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  universe: UniverseKey;
  description: string;
  image: string;
}

export interface Organization {
  id: string;
  name: string;
  mandate: string;
  description: string;
}
