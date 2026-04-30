"use client";

import { seedComments } from "@/lib/content";
import type { CommentRecord } from "@/lib/types";

const commentsStorageKey = "rcpu-comments";

function getLocalComments() {
  if (typeof window === "undefined") return seedComments;

  try {
    const raw = window.localStorage.getItem(commentsStorageKey);
    return raw ? (JSON.parse(raw) as Record<string, CommentRecord[]>) : seedComments;
  } catch {
    return seedComments;
  }
}

function setLocalComments(data: Record<string, CommentRecord[]>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(commentsStorageKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("rcpu-comments-updated"));
  } catch {
    return;
  }
}

export function subscribeToComments(
  chapterId: string,
  callback: (comments: CommentRecord[]) => void,
) {
  const sync = () => {
    const local = getLocalComments();
    callback([...(local[chapterId] ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  };

  sync();

  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("rcpu-comments-updated", sync);

  return () => window.removeEventListener("rcpu-comments-updated", sync);
}

export async function addComment(input: Omit<CommentRecord, "id" | "likes" | "likedBy" | "createdAt">) {
  const local = getLocalComments();
  const nextComment: CommentRecord = {
    id: `local-${Date.now()}`,
    userId: input.userId,
    userName: input.userName,
    chapterId: input.chapterId,
    text: input.text,
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };

  const chapterComments = local[input.chapterId] ?? [];
  setLocalComments({
    ...local,
    [input.chapterId]: [nextComment, ...chapterComments],
  });
}

export async function toggleCommentLike(comment: CommentRecord, userId: string) {
  const local = getLocalComments();
  const chapterComments = local[comment.chapterId] ?? [];
  const nextComments = chapterComments.map((entry) => {
    if (entry.id !== comment.id) return entry;
    const hasLiked = entry.likedBy.includes(userId);
    return {
      ...entry,
      likes: hasLiked ? Math.max(0, entry.likes - 1) : entry.likes + 1,
      likedBy: hasLiked
        ? entry.likedBy.filter((id) => id !== userId)
        : [...entry.likedBy, userId],
    };
  });

  setLocalComments({
    ...local,
    [comment.chapterId]: nextComments,
  });
}
