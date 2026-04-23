"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { FirebaseSync } from "./firebase-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FirebaseSync />
      {children}
    </AuthProvider>
  );
}