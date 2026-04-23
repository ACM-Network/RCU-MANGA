"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { persistUserLibrary } from "@/lib/firebase/user-library";

export function FirebaseSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    persistUserLibrary({
      id: user.uid,
      name: user.displayName || "RCPU Reader",
      email: user.email || "",
      bookmarks: [],
      readingHistory: {},
      likedChapters: [],
    });

    console.log("🔥 Firestore Sync:", user.uid);
  }, [user]);

  return null;
}