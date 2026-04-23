"use client";

import { getBytes, ref } from "firebase/storage";

import { storage } from "@/lib/firebase/client";
import type { ChapterPageAsset } from "@/lib/types";

interface ReaderAssetOptions {
  preferProtected: boolean;
  viewerId: string;
}

const readerAssetCacheName = "realm-cinematic-reader-pages-v1";
const blobPromiseCache = new Map<string, Promise<Blob>>();
const objectUrlCache = new Map<string, string>();
const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_FETCHES_PER_WINDOW = 90;

function guessMimeType(path: string) {
  if (path.endsWith(".jpeg") || path.endsWith(".jpg")) {
    return "image/jpeg";
  }

  if (path.endsWith(".png")) {
    return "image/png";
  }

  if (path.endsWith(".webp")) {
    return "image/webp";
  }

  if (path.endsWith(".svg")) {
    return "image/svg+xml";
  }

  return "application/octet-stream";
}

function createCacheRequest(cacheKey: string) {
  const encodedKey = encodeURIComponent(cacheKey);
  return new Request(`${window.location.origin}/__reader-cache__/${encodedKey}`);
}

async function readCachedBlob(cacheKey: string) {
  if (typeof window === "undefined" || typeof window.caches === "undefined") {
    return null;
  }

  const cache = await window.caches.open(readerAssetCacheName);
  const match = await cache.match(createCacheRequest(cacheKey));
  return match ? match.blob() : null;
}

async function writeCachedBlob(cacheKey: string, blob: Blob) {
  if (typeof window === "undefined" || typeof window.caches === "undefined") {
    return;
  }

  const cache = await window.caches.open(readerAssetCacheName);
  await cache.put(
    createCacheRequest(cacheKey),
    new Response(blob, {
      headers: {
        "content-type": blob.type || "application/octet-stream",
        "cache-control": "public, max-age=604800, immutable",
      },
    }),
  );
}

function enforceRateLimit(viewerId: string) {
  if (!viewerId || viewerId === "guest") {
    return;
  }

  const now = Date.now();
  const existingBucket = rateLimitBuckets.get(viewerId);

  if (!existingBucket || now - existingBucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(viewerId, {
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (existingBucket.count >= MAX_FETCHES_PER_WINDOW) {
    throw new Error("Reader protection paused additional page loads for a moment. Please try again shortly.");
  }

  existingBucket.count += 1;
  rateLimitBuckets.set(viewerId, existingBucket);
}

async function fetchPreviewBlob(previewSrc: string) {
  const response = await fetch(previewSrc, {
    cache: "force-cache",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("The requested manga page could not be loaded.");
  }

  return response.blob();
}

async function fetchProtectedBlob(storagePath: string) {
  if (!storage) {
    throw new Error("Protected chapter storage is unavailable.");
  }

  const bytes = await getBytes(ref(storage, storagePath));
  return new Blob([bytes], {
    type: guessMimeType(storagePath),
  });
}

async function fetchPageBlob(page: ChapterPageAsset, options: ReaderAssetOptions) {
  const protectedKey = page.storagePath ? `protected:${page.storagePath}` : null;
  const previewKey = `preview:${page.previewSrc}`;

  if (options.preferProtected && protectedKey && page.storagePath) {
    enforceRateLimit(options.viewerId);

    const cachedProtected = await readCachedBlob(protectedKey);
    if (cachedProtected) {
      return cachedProtected;
    }

    try {
      const blob = await fetchProtectedBlob(page.storagePath);
      await writeCachedBlob(protectedKey, blob);
      return blob;
    } catch {
      const cachedPreview = await readCachedBlob(previewKey);
      if (cachedPreview) {
        return cachedPreview;
      }
    }
  }

  const cachedPreview = await readCachedBlob(previewKey);
  if (cachedPreview) {
    return cachedPreview;
  }

  const previewBlob = await fetchPreviewBlob(page.previewSrc);
  await writeCachedBlob(previewKey, previewBlob);
  return previewBlob;
}

function getBlobCacheKey(page: ChapterPageAsset, options: ReaderAssetOptions) {
  if (options.preferProtected && page.storagePath) {
    return `protected:${page.storagePath}`;
  }

  return `preview:${page.previewSrc}`;
}

export async function getPageObjectUrl(page: ChapterPageAsset, options: ReaderAssetOptions) {
  const cacheKey = getBlobCacheKey(page, options);

  if (objectUrlCache.has(cacheKey)) {
    return objectUrlCache.get(cacheKey)!;
  }

  if (!blobPromiseCache.has(cacheKey)) {
    blobPromiseCache.set(cacheKey, fetchPageBlob(page, options));
  }

  const blob = await blobPromiseCache.get(cacheKey)!;
  const objectUrl = URL.createObjectURL(blob);

  objectUrlCache.set(cacheKey, objectUrl);
  return objectUrl;
}

export function preloadPageAsset(page: ChapterPageAsset, options: ReaderAssetOptions) {
  void getPageObjectUrl(page, options).catch(() => undefined);
}
