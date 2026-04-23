import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Account | Realm Cinematic",
  description: "Login or create a Realm Cinematic reader account backed by Firebase Authentication.",
};

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AuthPanel />
    </div>
  );
}
