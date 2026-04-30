"use client";

import type { ChapterPageAsset } from "@/lib/types";

const MAX_CACHED_IMAGES = 32;
const imagePromiseCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Reader images can only be loaded in the browser."));
  }

  const image = new window.Image();
  image.decoding = "async";
  image.loading = "eager";

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      image.onload = null;
      image.onerror = null;

      if (image.decode) {
        void image.decode().catch(() => undefined).finally(() => resolve(image));
        return;
      }

      resolve(image);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error("The requested manga page could not be loaded."));
    };
    image.src = src;
  });
}

export function loadPageImage(page: ChapterPageAsset) {
  const src = page.src;

  if (!imagePromiseCache.has(src)) {
    while (imagePromiseCache.size >= MAX_CACHED_IMAGES) {
      const oldestKey = imagePromiseCache.keys().next().value;
      if (!oldestKey) break;
      imagePromiseCache.delete(oldestKey);
    }

    imagePromiseCache.set(
      src,
      loadImage(src).catch((error) => {
        imagePromiseCache.delete(src);
        throw error;
      }),
    );
  }

  return imagePromiseCache.get(src)!;
}

export function preloadPageAsset(page: ChapterPageAsset) {
  void loadPageImage(page).catch(() => undefined);
}
