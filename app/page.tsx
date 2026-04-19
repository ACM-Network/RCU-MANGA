import { BecauseYouRead } from "@/components/home/because-you-read";
import { ContinueReading } from "@/components/home/continue-reading";
import { HeroBanner } from "@/components/home/hero-banner";
import { PosterCard } from "@/components/manga/poster-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedMangaList, getLatestUpdates, getTrendingManga } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedMangaList(3);
  const trending = getTrendingManga();
  const latest = getLatestUpdates();

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <HeroBanner manga={featured} />

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="For You"
          title="Continue Reading"
          description="Reading history syncs to your profile and surfaces the exact chapter you left off on."
        />
        <ContinueReading />
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Momentum"
          title="Trending Manga"
          description="High-velocity stories with the strongest engagement across the connected universe."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((entry) => (
            <PosterCard key={entry.id} manga={entry} />
          ))}
        </div>
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Smart Picks"
          title="Because You Read"
          description="A first-pass recommendation rail built from your recent reading history, genre overlap, and universe affinity."
        />
        <BecauseYouRead />
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Fresh Drops"
          title="Latest Updates"
          description="New chapter releases, recent universe movement, and fast access to current story arcs."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latest.map((entry) => (
            <PosterCard key={entry.id} manga={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
