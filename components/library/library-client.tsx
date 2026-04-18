"use client";

import { useMemo, useState } from "react";

import { PosterCard } from "@/components/manga/poster-card";
import type { Manga, MangaStatus, UniverseKey } from "@/lib/types";

interface LibraryClientProps {
  manga: Manga[];
}

export function LibraryClient({ manga }: LibraryClientProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [universe, setUniverse] = useState<UniverseKey | "All">("All");
  const [status, setStatus] = useState<MangaStatus | "All">("All");

  const genres = useMemo(
    () => ["All", ...new Set(manga.flatMap((entry) => entry.genre))],
    [manga],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return manga.filter((entry) => {
      const matchesSearch =
        !query ||
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.genre.some((item) => item.toLowerCase().includes(query));

      const matchesGenre = genre === "All" || entry.genre.includes(genre);
      const matchesUniverse = universe === "All" || entry.universe === universe;
      const matchesStatus = status === "All" || entry.status === status;

      return matchesSearch && matchesGenre && matchesUniverse && matchesStatus;
    });
  }, [genre, manga, search, status, universe]);

  return (
    <div className="space-y-8">
      <div className="panel rounded-[30px] p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, themes, genres..."
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-rose-500/60"
          />
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          >
            {genres.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={universe}
            onChange={(event) => setUniverse(event.target.value as UniverseKey | "All")}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          >
            {["All", "RCPU", "Strings Universe"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as MangaStatus | "All")}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          >
            {["All", "Ongoing", "Completed"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((entry) => (
          <PosterCard key={entry.id} manga={entry} />
        ))}
      </div>

      {!filtered.length ? (
        <div className="panel rounded-[28px] p-6 text-zinc-300">
          No series match the current filters. Try widening the genre or search query.
        </div>
      ) : null}
    </div>
  );
}
