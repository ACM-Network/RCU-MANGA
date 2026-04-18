import type { MetadataRoute } from "next";

import { mangaLibrary } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/library", "/auth", "/universe"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const mangaRoutes = mangaLibrary.flatMap((manga) => [
    {
      url: `${siteConfig.url}/manga/${manga.slug}`,
      lastModified: new Date(manga.chapters[manga.chapters.length - 1]?.createdAt ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...manga.chapters.map((chapter) => ({
      url: `${siteConfig.url}/manga/${manga.slug}/chapter/${chapter.id}`,
      lastModified: new Date(chapter.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);

  return [...staticRoutes, ...mangaRoutes];
}
