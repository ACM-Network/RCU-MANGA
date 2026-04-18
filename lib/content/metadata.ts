import type { MangaStatus, UniverseKey } from "@/lib/types";

export interface MangaMetadata {
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
}

export const mangaMetadata: MangaMetadata[] = [
  {
    id: "manga-strings-of-you",
    slug: "strings-of-you",
    title: "Strings of You",
    tagline: "A red thread that refuses to break across worlds.",
    description:
      "A tender crossover romance carrying the visual language of the Strings Universe into RCPU's broader mythos. Memory, distance, and destiny all tighten around a bond that keeps resurfacing no matter how reality bends.",
    coverImage: "/covers/strings-of-you.jpeg",
    heroImage: "/covers/strings-of-you.jpeg",
    genre: ["Romance", "Fantasy", "Drama"],
    universe: "Strings Universe",
    status: "Ongoing",
    accent: "#ff4d6d",
    trendingScore: 100,
    updatedLabel: "New",
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
  },
];
