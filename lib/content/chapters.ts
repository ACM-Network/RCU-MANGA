import type { Chapter, ChapterPageAsset } from "@/lib/types";

function createPages(chapterId: string, previewSources: string[]): ChapterPageAsset[] {
  return previewSources.map((previewSrc, index) => {
    const extension = previewSrc.split(".").pop() ?? "jpg";

    return {
      id: `${chapterId}-pg-${String(index + 1).padStart(2, "0")}`,
      previewSrc,
      storagePath: `manga/${chapterId}/asset-${index + 1}-${(index + 17).toString(36)}.${extension}`,
    };
  });
}

export const mangaChapters: Record<string, Chapter[]> = {
  "strings-of-you": [
    {
      id: "soy-001",
      slug: "chapter-1",
      number: 1,
      title: "The Red Thread",
      createdAt: "2026-04-16",
      synopsis: "The moment their destinies silently connect.",
      pages: createPages("soy-001", [
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
      ]),
    },
  ],
  "strings-of-ruin": [
    {
      id: "sr-001",
      slug: "the-first-tuning",
      number: 1,
      title: "The First Tuning",
      createdAt: "2026-03-28",
      synopsis:
        "Kael hears a dead queen singing from the roots beneath the city and answers with a forbidden chord.",
      pages: createPages("sr-001", [
        "/reader/panel-vow.svg",
        "/reader/panel-echo.svg",
        "/reader/panel-rift.svg",
        "/reader/panel-dawn.svg",
      ]),
    },
    {
      id: "sr-002",
      slug: "cathedral-of-wires",
      number: 2,
      title: "Cathedral of Wires",
      createdAt: "2026-04-06",
      synopsis:
        "A machine cathedral awakens in the rain, and its bells begin naming every liar in the district.",
      pages: createPages("sr-002", [
        "/reader/panel-echo.svg",
        "/reader/panel-cityfall.svg",
        "/reader/panel-vow.svg",
        "/reader/panel-rift.svg",
      ]),
    },
    {
      id: "sr-003",
      slug: "kingdom-under-the-hum",
      number: 3,
      title: "Kingdom Under the Hum",
      createdAt: "2026-04-15",
      synopsis:
        "The underground court offers Kael a throne if he agrees to let the surface world forget sunlight.",
      pages: createPages("sr-003", [
        "/reader/panel-rift.svg",
        "/reader/panel-dawn.svg",
        "/reader/panel-cityfall.svg",
        "/reader/panel-nexus.svg",
      ]),
    },
  ],
  "nexus-requiem": [
    {
      id: "nr-001",
      slug: "redacted-morning",
      number: 1,
      title: "Redacted Morning",
      createdAt: "2026-02-01",
      synopsis:
        "Director Arden receives simultaneous distress signals from four cities and has resources for only one intervention.",
      pages: createPages("nr-001", [
        "/reader/panel-nexus.svg",
        "/reader/panel-cityfall.svg",
        "/reader/panel-dawn.svg",
      ]),
    },
    {
      id: "nr-002",
      slug: "door-six",
      number: 2,
      title: "Door Six",
      createdAt: "2026-02-08",
      synopsis:
        "The hidden sixth evacuation gate opens, revealing that NEXUS has been preserving a secret population all along.",
      pages: createPages("nr-002", [
        "/reader/panel-vow.svg",
        "/reader/panel-nexus.svg",
        "/reader/panel-echo.svg",
      ]),
    },
    {
      id: "nr-003",
      slug: "requiem-protocol",
      number: 3,
      title: "Requiem Protocol",
      createdAt: "2026-02-15",
      synopsis:
        "Arden broadcasts the truth and burns his own command chain to keep the universe from being rewritten by the survivors.",
      pages: createPages("nr-003", [
        "/reader/panel-rift.svg",
        "/reader/panel-vow.svg",
        "/reader/panel-dawn.svg",
      ]),
    },
  ],
  "ember-veil": [
    {
      id: "ev-001",
      slug: "ash-market",
      number: 1,
      title: "Ash Market",
      createdAt: "2026-03-12",
      synopsis:
        "Mae enters the night market to trade a memory for the location of a stolen relic tied to the RCPU core mythos.",
      pages: createPages("ev-001", [
        "/reader/panel-dawn.svg",
        "/reader/panel-vow.svg",
        "/reader/panel-echo.svg",
      ]),
    },
    {
      id: "ev-002",
      slug: "oathfire",
      number: 2,
      title: "Oathfire",
      createdAt: "2026-03-20",
      synopsis:
        "A pact with a masked guardian gives Mae the power to open sealed shrines at the cost of her own past.",
      pages: createPages("ev-002", [
        "/reader/panel-vow.svg",
        "/reader/panel-rift.svg",
        "/reader/panel-cityfall.svg",
      ]),
    },
    {
      id: "ev-003",
      slug: "veil-at-zero-hour",
      number: 3,
      title: "Veil at Zero Hour",
      createdAt: "2026-04-14",
      synopsis:
        "As the veil ignites above the capital, Mae sees the same eclipse engine that powers Eclipse Protocol.",
      pages: createPages("ev-003", [
        "/reader/panel-cityfall.svg",
        "/reader/panel-dawn.svg",
        "/reader/panel-nexus.svg",
      ]),
    },
  ],
};
