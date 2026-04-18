"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/universe", label: "Universe" },
  { href: "/auth", label: "Account" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-fuchsia-700 text-sm font-black tracking-[0.22em] text-white shadow-[0_0_24px_rgba(255,49,93,0.25)]">
            RCPU
          </div>
          <div>
            <p className="section-title text-base text-white">Realm Cinematic</p>
            <p className="text-xs uppercase tracking-[0.36em] text-zinc-400">Publishing Universe</p>
          </div>
        </Link>

        <nav className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] transition",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,49,93,0.12)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300">
            {user ? `Signed in as ${user.displayName ?? user.email}` : "Guest Mode"}
          </span>
          {user ? (
            <button
              onClick={() => void signOut()}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-200 transition hover:bg-white/10"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
