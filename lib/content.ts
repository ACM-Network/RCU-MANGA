import type {
  CharacterProfile,
  CommentRecord,
  Manga,
  Organization,
  TimelineEvent,
} from "@/lib/types";

export const mangaLibrary: Manga[] = [
 {
  id: "strings-of-you",
  slug: "strings-of-you",
  title: "Strings of You",
  tagline: "A red thread that refuses to break across worlds.",
  description: "A story of destiny, connection, and a bond that transcends universes.",
  coverImage: "/covers/strings-of-you.jpeg",
  heroImage: "/covers/strings-of-you.jpeg",
  universe: "Strings Universe",
  genre: ["Romance", "Fantasy"],
  status: "Ongoing",
  accent: "#ff4d6d",
  trendingScore: 100,
  updatedLabel: "New",
  chapters: [
    {
      id: "soy-001",
      slug: "chapter-1",
      number: 1,
      title: "The Red Thread",
      createdAt: "2026-04-16",
      synopsis: "The moment their destinies silently connect.",
      images: [
        "/manga/soy/ch1/1.jpeg",
        "/manga/soy/ch1/2.jpeg",
        "/manga/soy/ch1/3.jpeg",
        "/manga/soy/ch1/4.jpeg",
        "/manga/soy/ch1/5.jpeg",
        "/manga/soy/ch1/6.jpeg",
        "/manga/soy/ch1/7.jpeg",
        "/manga/soy/ch1/8.jpeg",
        "/manga/soy/ch1/9.jpeg",
        "/manga/soy/ch1/10.jpeg",
        "/manga/soy/ch1/11.jpeg",
        "/manga/soy/ch1/12.jpeg",
        "/manga/soy/ch1/13.jpeg",
        "/manga/soy/ch1/14.jpeg",
      ],
    },
      {
        id: "ep-002",
        slug: "signal-bloodline",
        number: 2,
        title: "Signal Bloodline",
        createdAt: "2026-04-09",
        synopsis:
          "The stolen key reacts to Iris's family crest, exposing a bloodline tie to the first NEXUS breach team.",
        images: [
          "/reader/panel-cityfall.svg",
          "/reader/panel-vow.svg",
          "/reader/panel-rift.svg",
          "/reader/panel-echo.svg",
        ],
      },
      {
        id: "ep-003",
        slug: "moonless-engine",
        number: 3,
        title: "Moonless Engine",
        createdAt: "2026-04-16",
        synopsis:
          "Inside the buried engine chamber, Iris learns the apocalypse was designed as a reset protocol, not an accident.",
        images: [
          "/reader/panel-nexus.svg",
          "/reader/panel-dawn.svg",
          "/reader/panel-echo.svg",
          "/reader/panel-vow.svg",
        ],
      },
    ],
  },
  {
    id: "manga-strings-of-ruin",
    slug: "strings-of-ruin",
    title: "Strings of Ruin",
    tagline: "Fate is not written. It is stitched into your skin.",
    description:
      "The Strings Universe opens with Kael Serrin, a fugitive listener who hears the threads of destiny as music. Every note he breaks tears reality a little wider, pulling ancient choirs, ruined kingdoms, and impossible monsters into the present day.",
    coverImage: "/covers/strings-of-ruin.svg",
    heroImage: "/covers/strings-of-ruin.svg",
    genre: ["Dark Fantasy", "Mystery", "Adventure"],
    universe: "Strings Universe",
    status: "Ongoing",
    accent: "#8b5cf6",
    trendingScore: 94,
    updatedLabel: "Today",
    chapters: [
      {
        id: "sr-001",
        slug: "the-first-tuning",
        number: 1,
        title: "The First Tuning",
        createdAt: "2026-03-28",
        synopsis:
          "Kael hears a dead queen singing from the roots beneath the city and answers with a forbidden chord.",
        images: [
          "/reader/panel-vow.svg",
          "/reader/panel-echo.svg",
          "/reader/panel-rift.svg",
          "/reader/panel-dawn.svg",
        ],
      },
      {
        id: "sr-002",
        slug: "cathedral-of-wires",
        number: 2,
        title: "Cathedral of Wires",
        createdAt: "2026-04-06",
        synopsis:
          "A machine cathedral awakens in the rain, and its bells begin naming every liar in the district.",
        images: [
          "/reader/panel-echo.svg",
          "/reader/panel-cityfall.svg",
          "/reader/panel-vow.svg",
          "/reader/panel-rift.svg",
        ],
      },
      {
        id: "sr-003",
        slug: "kingdom-under-the-hum",
        number: 3,
        title: "Kingdom Under the Hum",
        createdAt: "2026-04-15",
        synopsis:
          "The underground court offers Kael a throne if he agrees to let the surface world forget sunlight.",
        images: [
          "/reader/panel-rift.svg",
          "/reader/panel-dawn.svg",
          "/reader/panel-cityfall.svg",
          "/reader/panel-nexus.svg",
        ],
      },
    ],
  },
  {
    id: "manga-nexus-requiem",
    slug: "nexus-requiem",
    title: "Nexus Requiem",
    tagline: "The agency that saves reality is already mourning it.",
    description:
      "A compact RCPU espionage arc centered on Director Sol Arden during the week NEXUS decided which cities were allowed to survive. The series deepens the political spine of the universe and reframes the cost of every rescue mission.",
    coverImage: "/covers/nexus-requiem.svg",
    heroImage: "/covers/nexus-requiem.svg",
    genre: ["Political Thriller", "Drama", "Sci-Fi"],
    universe: "RCPU",
    status: "Completed",
    accent: "#f43f5e",
    trendingScore: 87,
    updatedLabel: "3d ago",
    chapters: [
      {
        id: "nr-001",
        slug: "redacted-morning",
        number: 1,
        title: "Redacted Morning",
        createdAt: "2026-02-01",
        synopsis:
          "Director Arden receives simultaneous distress signals from four cities and has resources for only one intervention.",
        images: [
          "/reader/panel-nexus.svg",
          "/reader/panel-cityfall.svg",
          "/reader/panel-dawn.svg",
        ],
      },
      {
        id: "nr-002",
        slug: "door-six",
        number: 2,
        title: "Door Six",
        createdAt: "2026-02-08",
        synopsis:
          "The hidden sixth evacuation gate opens, revealing that NEXUS has been preserving a secret population all along.",
        images: [
          "/reader/panel-vow.svg",
          "/reader/panel-nexus.svg",
          "/reader/panel-echo.svg",
        ],
      },
      {
        id: "nr-003",
        slug: "requiem-protocol",
        number: 3,
        title: "Requiem Protocol",
        createdAt: "2026-02-15",
        synopsis:
          "Arden broadcasts the truth and burns his own command chain to keep the universe from being rewritten by the survivors.",
        images: [
          "/reader/panel-rift.svg",
          "/reader/panel-vow.svg",
          "/reader/panel-dawn.svg",
        ],
      },
    ],
  },
  {
    id: "manga-ember-veil",
    slug: "ember-veil",
    title: "Ember Veil",
    tagline: "Every oath leaves a scar. Every scar becomes a gate.",
    description:
      "A romantic fantasy branch of RCPU where shrine-runner Mae Ilyan carries a fire veil that burns lies out of memory. Her journey expands the spiritual architecture behind the cinematic universe and introduces the first crossover relic between worlds.",
    coverImage: "/covers/ember-veil.svg",
    heroImage: "/covers/ember-veil.svg",
    genre: ["Fantasy", "Romance", "Action"],
    universe: "RCPU",
    status: "Ongoing",
    accent: "#fb7185",
    trendingScore: 90,
    updatedLabel: "Yesterday",
    chapters: [
      {
        id: "ev-001",
        slug: "ash-market",
        number: 1,
        title: "Ash Market",
        createdAt: "2026-03-12",
        synopsis:
          "Mae enters the night market to trade a memory for the location of a stolen relic tied to the RCPU core mythos.",
        images: [
          "/reader/panel-dawn.svg",
          "/reader/panel-vow.svg",
          "/reader/panel-echo.svg",
        ],
      },
      {
        id: "ev-002",
        slug: "oathfire",
        number: 2,
        title: "Oathfire",
        createdAt: "2026-03-20",
        synopsis:
          "A pact with a masked guardian gives Mae the power to open sealed shrines at the cost of her own past.",
        images: [
          "/reader/panel-vow.svg",
          "/reader/panel-rift.svg",
          "/reader/panel-cityfall.svg",
        ],
      },
      {
        id: "ev-003",
        slug: "veil-at-zero-hour",
        number: 3,
        title: "Veil at Zero Hour",
        createdAt: "2026-04-14",
        synopsis:
          "As the veil ignites above the capital, Mae sees the same eclipse engine that powers Eclipse Protocol.",
        images: [
          "/reader/panel-cityfall.svg",
          "/reader/panel-dawn.svg",
          "/reader/panel-nexus.svg",
        ],
      },
    ],
  },
];

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
    year: "2048",
    title: "The Black Sky Directive",
    description:
      "A classified orbital program goes dark, leaving only fragmented moonfall transmissions scattered across the lower net.",
    stories: ["Eclipse Protocol"],
  },
  {
    year: "2050",
    title: "The Thread Choir Wakes",
    description:
      "Reality harmonics erupt inside the Strings Universe, creating the first echo bridge between separate continuities.",
    stories: ["Strings of Ruin"],
  },
  {
    year: "2052",
    title: "Convergence Window",
    description:
      "Artifacts from multiple storylines begin sharing energy signatures, confirming the cinematic-universe crossover event.",
    stories: ["Eclipse Protocol", "Ember Veil", "Strings of Ruin"],
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
  "ep-003": [
    {
      id: "comment-1",
      userId: "guest-sable",
      userName: "SableFrame",
      chapterId: "ep-003",
      text: "That engine reveal finally explains why Ember Veil and Eclipse Protocol share the same crest language.",
      likes: 12,
      likedBy: [],
      createdAt: "2026-04-16T08:45:00.000Z",
    },
    {
      id: "comment-2",
      userId: "guest-lattice",
      userName: "LatticeNine",
      chapterId: "ep-003",
      text: "The panel pacing in the chamber sequence feels like a trailer cut in manga form. Exactly what this universe needed.",
      likes: 9,
      likedBy: [],
      createdAt: "2026-04-16T09:20:00.000Z",
    },
  ],
};

export function getFeaturedManga() {
  return mangaLibrary[0];
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
