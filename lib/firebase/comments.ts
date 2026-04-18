"use client";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { seedComments } from "@/lib/content";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import type { CommentRecord } from "@/lib/types";

const storageKey = "rcpu-comments";

function getLocalComments() {
  if (typeof window === "undefined") return seedComments;
  const raw = window.localStorage.getItem(storageKey);
  return raw ? (JSON.parse(raw) as Record<string, CommentRecord[]>) : seedComments;
}

function setLocalComments(data: Record<string, CommentRecord[]>) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("rcpu-comments-updated"));
}

export function subscribeToComments(
  chapterId: string,
  callback: (comments: CommentRecord[]) => void,
) {
  if (isFirebaseConfigured && db) {
    const commentsQuery = query(collection(db, "comments"), where("chapterId", "==", chapterId));

    return onSnapshot(commentsQuery, (snapshot) => {
      callback(
        snapshot.docs
          .map((entry) => {
            const data = entry.data();

            return {
              id: entry.id,
              userId: data.userId,
              userName: data.userName,
              chapterId: data.chapterId,
              text: data.text,
              likes: data.likes ?? 0,
              likedBy: data.likedBy ?? [],
              createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
            } satisfies CommentRecord;
          })
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    });
  }

  const sync = () => {
    const local = getLocalComments();
    callback((local[chapterId] ?? []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  };

  sync();
  window.addEventListener("rcpu-comments-updated", sync);

  return () => window.removeEventListener("rcpu-comments-updated", sync);
}

export async function addComment(input: Omit<CommentRecord, "id" | "likes" | "likedBy" | "createdAt">) {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, "comments"), {
      ...input,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
    });
    return;
  }

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
  if (isFirebaseConfigured && db) {
    const commentRef = doc(db, "comments", comment.id);
    const hasLiked = comment.likedBy.includes(userId);
    await updateDoc(commentRef, {
      likes: increment(hasLiked ? -1 : 1),
      likedBy: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
    });
    return;
  }

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
