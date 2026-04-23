"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { ensureUserProfile } from "@/lib/firebase/user-library";

export function FirebaseSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    void ensureUserProfile({
      id: user.uid,
      name: user.displayName || "RCPU Reader",
      email: user.email || "",
    });
  }, [user]);

  return null;
}
