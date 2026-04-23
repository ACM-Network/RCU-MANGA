import { clsx, type ClassValue } from "clsx";

import type { ReadingHistoryEntry } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatChapterNumber(number: number) {
  return `Chapter ${String(number).padStart(2, "0")}`;
}

export function formatRelativeDay(dayLabel: string) {
  return `${dayLabel} update`;
}

export function getInitials(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "RC";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function sortReadingHistory(entries: ReadingHistoryEntry[]) {
  return [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
