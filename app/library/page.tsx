import type { Metadata } from "next";

import { LibraryClient } from "@/components/library/library-client";
import { SectionHeading } from "@/components/ui/section-heading";
import { mangaLibrary } from "@/lib/content";

export const metadata: Metadata = {
  title: "Manga Library | Realm Cinematic",
  description: "Browse the cinematic manga catalog across RCPU and Strings Universe.",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catalog"
        title="Manga Library"
        description="Browse the full catalog with a mobile-first filter system tuned for quick discovery and fast re-entry."
      />
      <LibraryClient manga={mangaLibrary} />
    </div>
  );
}
