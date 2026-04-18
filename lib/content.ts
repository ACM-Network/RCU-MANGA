import type {
  CharacterProfile,
  CommentRecord,
  Manga,
  Organization,
  TimelineEvent,
} from "@/lib/types";
import { mangaChapters } from "@/lib/content/chapters";
import { mangaMetadata } from "@/lib/content/metadata";

export const mangaLibrary: Manga[] = mangaMetadata.map((metadata) => ({
  ...metadata,
  chapters: mangaChapters[metadata.slug] ?? [],
}));

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2041",
    title: "NEXUS is Founded",
    description:
      "A private emergency coalition forms after the first recorded anomaly storm fractures public communications.",
    stories: ["Nexus Requiem"],
  },
  {
    year: "2046",
    title: "The First Veil Ignition",
    description:
      "Spiritual gatekeepers document an energy bloom identical to the signatures later seen in the eclipse engine.",
    stories: ["Ember Veil"],
  },
  {
    year: "2050",
    title: "The Thread Choir Wakes",
    description:
      "Reality harmonics erupt inside the Strings Universe, creating the first echo bridge between separate continuities.",
    stories: ["Strings of Ruin", "Strings of You"],
  },
  {
    year: "2052",
    title: "Convergence Window",
    description:
      "Artifacts from multiple storylines begin sharing energy signatures, confirming the cinematic-universe crossover event.",
    stories: ["Strings of You", "Ember Veil", "Strings of Ruin"],
  },
];

export const characterProfiles: CharacterProfile[] = [
  {
    id: "iris-vale",
    name: "Iris Vale",
    role: "Rogue tactician and eclipse key bearer",
    universe: "RCPU",
    description:
      "A field strategist raised inside NEXUS black sites, Iris weaponizes pattern recognition and brutal calm.",
    image: "/characters/iris-vale.svg",
  },
  {
    id: "kael-serrin",
    name: "Kael Serrin",
    role: "Thread listener and fugitive bard",
    universe: "Strings Universe",
    description:
      "Kael hears destiny as music and turns every song into either salvation or structural damage.",
    image: "/characters/kael-serrin.svg",
  },
  {
    id: "sol-arden",
    name: "Sol Arden",
    role: "Director of NEXUS",
    universe: "RCPU",
    description:
      "The most disciplined liar in the universe, Arden leads with precise sacrifice and impossible contingency trees.",
    image: "/characters/sol-arden.svg",
  },
  {
    id: "mae-ilyan",
    name: "Mae Ilyan",
    role: "Shrine runner carrying the Ember Veil",
    universe: "RCPU",
    description:
      "Mae crosses haunted districts with a relic that burns lies out of memory and opens sealed routes between myths.",
    image: "/characters/mae-ilyan.svg",
  },
];

export const organizations: Organization[] = [
  {
    id: "nexus",
    name: "NEXUS",
    mandate: "Contain anomalies before they become public wars.",
    description:
      "A cinematic-universe superstructure spanning intelligence, defense, and reality-risk management.",
  },
  {
    id: "velvet-synod",
    name: "Velvet Synod",
    mandate: "Control sacred relic traffic and veil access.",
    description:
      "A hidden order of archivists and smugglers who treat mythic artifacts as geopolitical currency.",
  },
  {
    id: "thread-choir",
    name: "Thread Choir",
    mandate: "Preserve the original song of fate.",
    description:
      "An ancient harmonic collective from the Strings Universe that sees free will as a catastrophic mutation.",
  },
];

export const seedComments: Record<string, CommentRecord[]> = {
  "soy-001": [
    {
      id: "comment-soy-1",
      userId: "guest-thread",
      userName: "Threadborne",
      chapterId: "soy-001",
      text: "The page pacing is gentle but still cinematic. This fits the RCPU identity really well.",
      likes: 6,
      likedBy: [],
      createdAt: "2026-04-18T08:45:00.000Z",
    },
  ],
};

export function getFeaturedManga() {
  return mangaLibrary[0];
}

export function getFeaturedMangaList(limit = 3) {
  return [...mangaLibrary].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit);
}

export function getTrendingManga() {
  return [...mangaLibrary].sort((a, b) => b.trendingScore - a.trendingScore);
}

export function getLatestUpdates() {
  return [...mangaLibrary].sort((a, b) => {
    const aDate = new Date(a.chapters[a.chapters.length - 1]?.createdAt ?? 0).getTime();
    const bDate = new Date(b.chapters[b.chapters.length - 1]?.createdAt ?? 0).getTime();
    return bDate - aDate;
  });
}

export function getMangaBySlug(slug: string) {
  return mangaLibrary.find((entry) => entry.slug === slug);
}

export function getChapter(mangaSlug: string, chapterId: string) {
  const manga = getMangaBySlug(mangaSlug);
  if (!manga) return null;
  const chapter = manga.chapters.find((entry) => entry.id === chapterId || entry.slug === chapterId);
  if (!chapter) return null;
  const chapterIndex = manga.chapters.findIndex((entry) => entry.id === chapter.id);

  return {
    manga,
    chapter,
    chapterIndex,
    previous: chapterIndex > 0 ? manga.chapters[chapterIndex - 1] : null,
    next: chapterIndex < manga.chapters.length - 1 ? manga.chapters[chapterIndex + 1] : null,
  };
}
