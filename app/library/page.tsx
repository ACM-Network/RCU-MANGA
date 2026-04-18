import type { Metadata } from "next";

import { LibraryClient } from "@/components/library/library-client";
import { SectionHeading } from "@/components/ui/section-heading";
import { mangaLibrary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Manga Library | RCPU",
  description: "Browse the cinematic manga catalog across RCPU and Strings Universe.",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catalog"
        title="Manga Library"
        description="Filter by genre, universe, and release status while keeping a poster-first cinematic browsing experience."
      />
      <LibraryClient manga={mangaLibrary} />
    </div>
  );
}
