"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { cn, getInitials } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/universe", label: "Universe" },
  { href: "/auth", label: "Account" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const identityLabel = user?.displayName?.trim() || user?.email || "Guest Reader";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#090a0f]/76 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src="/rcu-logo.png"
                alt="Realm Cinematic"
                fill
                sizes="44px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.28em] text-white">
                Realm Cinematic
              </p>
              <p className="truncate text-[11px] uppercase tracking-[0.32em] text-stone-400">
                Manga Platform
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] transition",
                    active
                      ? "bg-white/12 text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                      : "text-stone-400 hover:bg-white/6 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff8c58,#7adad0)] text-xs font-semibold text-black">
                {getInitials(identityLabel)}
              </div>
              <div className="max-w-[220px]">
                <p className="truncate text-xs uppercase tracking-[0.28em] text-stone-400">
                  {user ? "Signed In" : "Guest Mode"}
                </p>
                <p className="truncate text-sm text-white">{identityLabel}</p>
              </div>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-200 transition hover:bg-white/8"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-200 transition hover:bg-white/8"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 transition duration-300 md:hidden",
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className="absolute inset-0 bg-black/58 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        <aside
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col border-l border-white/10 bg-[#0f1015]/96 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff8c58,#7adad0)] text-sm font-semibold text-black">
                {getInitials(identityLabel)}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                  {user ? "Signed In" : "Guest Mode"}
                </p>
                <p className="truncate text-base font-medium text-white">{identityLabel}</p>
                <p className="truncate text-sm text-stone-400">{user?.email || "Create an account to unlock full chapters"}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-200 transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-[24px] border px-4 py-4 text-base font-medium transition",
                    active
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-transparent bg-white/[0.03] text-stone-200 hover:border-white/10 hover:bg-white/[0.06]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
