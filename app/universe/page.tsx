import type { Metadata } from "next";

import { UniversePage } from "@/components/universe/universe-page";

export const metadata: Metadata = {
  title: "Universe Lore | RCPU",
  description: "Explore the timeline, characters, factions, and crossover map behind the RCPU franchise.",
};

export default function UniverseRoute() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <UniversePage />
    </div>
  );
}
