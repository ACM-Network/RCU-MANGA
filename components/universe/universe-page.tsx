import Image from "next/image";

import { characterProfiles, organizations, timelineEvents } from "@/lib/content";

export function UniversePage() {
  return (
    <div className="space-y-12">
      <section className="panel overflow-hidden rounded-[34px] px-6 py-8 sm:px-8 lg:px-10">
        <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Lore Intelligence</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-white sm:text-5xl">
          A connected manga universe built like a cinematic franchise.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-300">
          RCPU layers poster-grade presentation, crossover lore, and reader-friendly continuity so every story can stand alone while still feeding a larger narrative architecture.
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Timeline</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Universe Progression</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-5">
          {timelineEvents.map((event) => (
            <article key={event.title} className="panel rounded-[28px] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-100/80">{event.year}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{event.title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">{event.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {event.stories.map((story) => (
                  <span
                    key={story}
                    className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-stone-200"
                  >
                    {story}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Character Profiles</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Core Players</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {characterProfiles.map((character) => (
            <article key={character.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{character.universe}</p>
                <h3 className="text-2xl font-semibold text-white">{character.name}</h3>
                <p className="text-sm text-amber-100/80">{character.role}</p>
                <p className="text-sm leading-7 text-stone-300">{character.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Organizations</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Power Structures</h2>
          </div>
          <div className="space-y-4">
            {organizations.map((organization) => (
              <article key={organization.id} className="panel rounded-[26px] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{organization.mandate}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{organization.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{organization.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel rounded-[32px] p-6">
          <p className="text-xs uppercase tracking-[0.42em] text-amber-100/80">Interconnected Story Map</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Franchise Network</h2>
          <div className="mt-8 grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-black/30 p-5 text-center">
                <p className="section-title text-xl text-white">Eclipse Protocol</p>
                <p className="mt-2 text-sm text-stone-300">Core engine mystery</p>
              </div>
              <div className="story-map-line hidden h-1 self-center rounded-full md:block" />
              <div className="rounded-[24px] border border-white/8 bg-black/30 p-5 text-center">
                <p className="section-title text-xl text-white">Ember Veil</p>
                <p className="mt-2 text-sm text-stone-300">Relic and shrine mythology</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-10 w-1 rounded-full bg-gradient-to-b from-[#ff8a54]/40 to-[#76d6d1]/40" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-black/30 p-5 text-center">
                <p className="section-title text-xl text-white">Nexus Requiem</p>
                <p className="mt-2 text-sm text-stone-300">Political control layer</p>
              </div>
              <div className="story-map-line hidden h-1 self-center rounded-full md:block" />
              <div className="rounded-[24px] border border-white/8 bg-black/30 p-5 text-center">
                <p className="section-title text-xl text-white">Strings of Ruin</p>
                <p className="mt-2 text-sm text-stone-300">Reality bridge and crossover trigger</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
