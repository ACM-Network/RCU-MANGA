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
          eyebrow="Retention"
          title="Continue Reading"
          description="Your last read chapter is always pinned for instant re-entry, whether you're browsing as a guest or signed in."
        />
        <ContinueReading />
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Discovery"
          title="Trending Manga"
          description="High-velocity stories pulling the strongest engagement across the platform right now."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((entry) => (
            <PosterCard key={entry.id} manga={entry} />
          ))}
        </div>
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Personalized"
          title="Recommended For You"
          description="A basic recommendation layer driven by your recent reading history, genre overlap, and universe affinity."
        />
        <BecauseYouRead />
      </section>

      <section className="section-shell space-y-6">
        <SectionHeading
          eyebrow="Fresh Drops"
          title="Recently Updated"
          description="New chapter releases and current story movement across the connected manga universe."
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
