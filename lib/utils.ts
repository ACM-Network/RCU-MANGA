import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatChapterNumber(number: number) {
  return `Chapter ${String(number).padStart(2, "0")}`;
}

export function formatRelativeDay(dayLabel: string) {
  return `${dayLabel} update`;
}
