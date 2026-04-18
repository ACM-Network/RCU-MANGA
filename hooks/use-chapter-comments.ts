"use client";

import { useEffect, useState } from "react";

import { addComment, subscribeToComments, toggleCommentLike } from "@/lib/firebase/comments";
import type { CommentRecord } from "@/lib/types";

export function useChapterComments(chapterId: string) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToComments(chapterId, (nextComments) => {
      setComments(nextComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [chapterId]);

  return {
    comments,
    loading,
    addComment,
    toggleCommentLike,
  };
}
