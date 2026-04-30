import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Account | Realm Cinematic",
  description: "Login or create a Realm Cinematic reader account backed by Firebase Authentication.",
};

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="panel rounded-[34px] p-6 text-sm leading-7 text-stone-300 sm:p-8">
            Loading account panel...
          </div>
        }
      >
        <AuthPanel />
      </Suspense>
    </div>
  );
}
