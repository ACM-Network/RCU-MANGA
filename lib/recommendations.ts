import { mangaLibrary } from "@/lib/content";
import type { Manga, ReadingHistoryEntry } from "@/lib/types";

function scoreAgainstSource(candidate: Manga, source: Manga) {
  const sharedGenres = candidate.genre.filter((genre) => source.genre.includes(genre)).length;
  const sameUniverse = candidate.universe === source.universe ? 3 : 0;
  const score = sharedGenres * 2 + sameUniverse + candidate.trendingScore / 100;

  return {
    manga: candidate,
    score,
  };
}

export function getBecauseYouReadRecommendations(history: ReadingHistoryEntry[], limit = 4) {
  const recentHistory = [...history].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  const sources = recentHistory
    .map((entry) => mangaLibrary.find((manga) => manga.slug === entry.mangaSlug))
    .filter((manga): manga is Manga => Boolean(manga));

  if (!sources.length) return [];

  return mangaLibrary
    .filter((candidate) => !sources.some((source) => source.slug === candidate.slug))
    .map((candidate) => {
      const topScore = Math.max(...sources.map((source) => scoreAgainstSource(candidate, source).score));
      return {
        manga: candidate,
        score: topScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.manga);
}

export function getSimilarTitles(manga: Manga, limit = 4) {
  return mangaLibrary
    .filter((candidate) => candidate.slug !== manga.slug)
    .map((candidate) => scoreAgainstSource(candidate, manga))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.manga);
}

export function getSameUniverseTitles(manga: Manga, limit = 4) {
  return mangaLibrary
    .filter((candidate) => candidate.slug !== manga.slug && candidate.universe === manga.universe)
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}
