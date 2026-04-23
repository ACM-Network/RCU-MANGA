"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isReaderRoute = pathname.startsWith("/read/");

  if (isReaderRoute) {
    return children;
  }

  return (
    <div className="page-shell min-h-screen">
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
